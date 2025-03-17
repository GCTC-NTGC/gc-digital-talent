<?php

namespace App\Models;

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
 * @property string $advancement_decision
 * @property bool $advancement_reference_confirmed
 * @property string $advancement_notes
 * @property string $lateral_movement_decision
 * @property string $lateral_movement_notes
 * @property string $development_program_decision
 * @property string $development_program_notes
 * @property string $computed_status
 * @property string $talent_nomination_group_id
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
}
