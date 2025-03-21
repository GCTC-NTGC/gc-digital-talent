<?php

namespace App\Models;

use App\Observers\TalentNominationObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class TalentNomination
 *
 * @property string $id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property array $submitted_steps
 * @property string $talent_nomination_event_id
 * @property \Illuminate\Support\Carbon $submitted_at
 * @property string $submitter_id
 * @property string $submitter_relationship_to_nominator
 * @property string $submitter_relationship_to_nominator_other
 * @property string $nominator_id
 * @property string $nominator_fallback_work_email
 * @property string $nominator_fallback_name
 * @property string $nominator_fallback_classification_id
 * @property string $nominator_fallback_department_id
 * @property string $nominator_review
 * @property string $nominee_id
 * @property string $nominee_review
 * @property string $nominee_relationship_to_nominator
 * @property string $nominee_relationship_to_nominator_other
 * @property bool $nominate_for_advancement
 * @property bool $nominate_for_lateral_movement
 * @property bool $nominate_for_development_programs
 * @property string $advancement_reference_id
 * @property string $advancement_reference_review
 * @property string $advancement_reference_fallback_work_email
 * @property string $advancement_reference_fallback_name
 * @property string $advancement_reference_fallback_classification_id
 * @property string $advancement_reference_fallback_department_id
 * @property array $lateral_movement_options
 * @property string $lateral_movement_options_other
 * @property string $development_program_options_other
 * @property string $nomination_rationale
 * @property string $additional_comments
 * @property string $talent_nomination_group_id
 */
class TalentNomination extends Model
{
    /** @use HasFactory<\Database\Factories\TalentNominationFactory> */
    use HasFactory;

    use LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'nominate_for_advancement',
        'nominate_for_lateral_movement',
        'nominate_for_development_programs',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'submitted_steps' => 'array',
            'submitted_at' => 'datetime',
            'lateral_movement_options' => 'array',
        ];
    }

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
        TalentNomination::observe(TalentNominationObserver::class);
    }

    /** @return BelongsTo<TalentNominationEvent, $this> */
    public function talentNominationEvent(): BelongsTo
    {
        return $this->belongsTo(TalentNominationEvent::class);
    }

    /** @return BelongsTo<User, $this> */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitter_id')->isVerifiedGovEmployee();
    }

    /** @return BelongsTo<User, $this> */
    public function nominator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nominator_id')->isVerifiedGovEmployee();
    }

    /** @return BelongsTo<Classification, $this> */
    public function nominatorFallbackClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'nominator_fallback_classification_id');
    }

    /** @return BelongsTo<Department, $this> */
    public function nominatorFallbackDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'nominator_fallback_department_id');
    }

    /** @return BelongsTo<User, $this> */
    public function nominee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nominee_id')->isVerifiedGovEmployee();
    }

    /** @return BelongsTo<User, $this> */
    public function advancementReference(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advancement_reference_id')->isVerifiedGovEmployee();
    }

    /** @return BelongsTo<Classification, $this> */
    public function advancementReferenceFallbackClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'advancement_reference_fallback_classification_id');
    }

    /** @return BelongsTo<Department, $this> */
    public function advancementReferenceFallbackDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'advancement_reference_fallback_department_id');
    }

    /** @return BelongsToMany<DevelopmentProgram, $this> */
    public function developmentPrograms(): BelongsToMany
    {
        return $this->belongsToMany(DevelopmentProgram::class, 'development_program_talent_nomination');
    }

    /** @return BelongsToMany<Skill, $this> */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'skill_talent_nomination');
    }

    /** @return BelongsTo<Department, $this> */
    public function talentNominationGroup(): BelongsTo
    {
        return $this->belongsTo(TalentNominationGroup::class, 'talent_nomination_group_id');
    }

    /**
     * Take the new application step to insert and add it to the array, preserving uniqueness
     */
    public function setInsertSubmittedStepAttribute($nominationStep)
    {
        $nominationSteps = collect([$this->submitted_steps, $nominationStep])->flatten()->unique();

        $this->submitted_steps = $nominationSteps->values()->all();
    }

    /**
     * Connect a talent nomination to a talent nomination group if it is missing
     */
    public function connectToTalentNominationGroupIfMissing()
    {
        if (! is_null($this->submitted_at)) {
            // this is a submitted nomination
            if (is_null($this->talent_nomination_group_id)) {
                // not yet attached to a group
                $talentNominationGroup = TalentNominationGroup::firstOrCreate(
                    ['nominee_id' => $this->nominee_id],
                    ['talent_nomination_event_id' => $this->talent_nomination_event_id],
                );

                $this->talent_nomination_group_id = $talentNominationGroup->id;
                $this->save();
            }
        }
    }

    /**
     * Determine if a talent nomination is in draft mode
     *
     * @return bool
     */
    public function isDraft()
    {
        return is_null($this->submitted_at) || $this->submitted_at->isFuture();
    }

    /**
     * Determine if a talent nomination is owned by a user
     *
     * @return bool
     */
    public function isOwn(User $user)
    {
        return $this->submitter_id === $user->id;
    }
}
