<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class Talent nomination
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
 * @property string $nominate_for_advancement
 * @property string $nominate_for_lateral_movement
 * @property string $nominate_for_development_programs
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
 */
class TalentNomination extends Model
{
    /** @use HasFactory<\Database\Factories\TalentNominationFactory> */
    use HasFactory;

    use LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'submitted_steps' => 'array',
        'lateral_movement_options' => 'array',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function talentNominationEvent(): BelongsTo
    {
        return $this->belongsTo(TalentNominationEvent::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitter_id');
    }

    public function nominator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nominator_id');
    }

    public function nominatorFallbackClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'nominator_fallback_classification_id');
    }

    public function nominatorFallbackDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'nominator_fallback_department_id');
    }

    public function nominee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nominee_id');
    }

    public function advancementReference(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advancement_reference_id');
    }

    public function advancementReferenceFallbackClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'nominator_fallback_classification_id');
    }

    public function advancementReferenceFallbackDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'nominator_fallback_department_id');
    }

    public function developmentPrograms(): BelongsToMany
    {
        return $this->belongsToMany(DevelopmentProgram::class, 'development_program_talent_nomination');
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'skill_talent_nomination');
    }
}
