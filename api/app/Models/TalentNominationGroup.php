<?php

namespace App\Models;

use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentNominationGroupStatus;
use App\Observers\TalentNominationGroupObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class TalentNominationGroup
 *
 * @property string $id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property string $nominee_id
 * @property string $talent_nomination_event_id
 * @property bool $computed_advancement_nomination_count
 * @property string $advancement_decision
 * @property bool $advancement_reference_confirmed
 * @property string $advancement_notes
 * @property bool $computed_lateral_movement_nomination_count
 * @property string $lateral_movement_decision
 * @property string $lateral_movement_notes
 * @property bool $computed_development_program_nomination_count
 * @property string $development_program_decision
 * @property string $development_program_notes
 * @property string $computed_status
 */
class TalentNominationGroup extends Model
{
    /** @use HasFactory<\Database\Factories\TalentNominationGroupFactory> */
    use HasFactory;

    use LogsActivity;

    protected $keyType = 'string';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        TalentNominationGroup::observe(TalentNominationGroupObserver::class);
    }

    /** @return BelongsTo<TalentNominationEvent, $this> */
    public function talentNominationEvent(): BelongsTo
    {
        return $this->belongsTo(TalentNominationEvent::class);
    }

    /** @return BelongsTo<User, $this> */
    public function nominee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nominee_id')->isVerifiedGovEmployee();
    }

    /** @return HasMany<TalentNomination, $this> */
    public function nominations(): HasMany
    {
        return $this->hasMany(TalentNomination::class, 'talent_nomination_group_id');
    }

    public function updateNominationCounts(): void
    {
        $this->loadMissing('nominations');

        $this->computed_advancement_nomination_count = $this->nominations->filter(fn (TalentNomination $nomination) => $nomination->nominate_for_advancement)->count();
        $this->computed_lateral_movement_nomination_count = $this->nominations->filter(fn (TalentNomination $nomination) => $nomination->nominate_for_lateral_movement)->count();
        $this->computed_development_program_nomination_count = $this->nominations->filter(fn (TalentNomination $nomination) => $nomination->nominate_for_development_programs)->count();

        $this->save();
    }

    public function updateStatus(): void
    {
        $unevaluatedFieldCount =
            ($this->computed_advancement_nomination_count > 0 && is_null($this->advancement_decision) ? 1 : 0) +
            ($this->computed_lateral_movement_nomination_count > 0 && is_null($this->lateral_movement_decision) ? 1 : 0) +
            ($this->computed_development_program_nomination_count > 0 && is_null($this->development_program_decision) ? 1 : 0);

        $rejectedCount =
            ($this->advancement_decision === TalentNominationGroupDecision::REJECTED->name ? 1 : 0) +
            ($this->lateral_movement_decision === TalentNominationGroupDecision::REJECTED->name ? 1 : 0) +
            ($this->development_program_decision === TalentNominationGroupDecision::REJECTED->name ? 1 : 0);

        $approvedCount =
            ($this->advancement_decision === TalentNominationGroupDecision::APPROVED->name ? 1 : 0) +
            ($this->lateral_movement_decision === TalentNominationGroupDecision::APPROVED->name ? 1 : 0) +
            ($this->development_program_decision === TalentNominationGroupDecision::APPROVED->name ? 1 : 0);

        $this->computed_status = match (true) {
            $unevaluatedFieldCount > 0 => TalentNominationGroupStatus::IN_PROGRESS->name,
            $rejectedCount > 0 && $approvedCount > 0 => TalentNominationGroupStatus::PARTIALLY_APPROVED->name,
            $rejectedCount > 0 && $approvedCount == 0 => TalentNominationGroupStatus::REJECTED->name,
            $rejectedCount == 0 && $approvedCount > 0 => TalentNominationGroupStatus::APPROVED->name,
            default => TalentNominationGroupStatus::IN_PROGRESS->name, // should never happen
        };

        $this->save();
    }
}
