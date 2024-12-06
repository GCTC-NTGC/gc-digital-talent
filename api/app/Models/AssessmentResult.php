<?php

namespace App\Models;

use App\Events\AssessmentResultSaved;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class AssessmentResult
 *
 * @property string $id
 * @property string $assessment_step_id
 * @property string $pool_candidate_id
 * @property ?string $pool_skill_id
 * @property ?string $assessment_result_type
 * @property ?string $assessment_decision
 * @property array $justifications
 * @property ?string $assessment_decision_level
 * @property ?string $skill_decision_notes
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class AssessmentResult extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'justifications' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [];

    /**
     * The event map for the model.
     *
     * @var array
     */
    protected $dispatchesEvents = [
        'saved' => AssessmentResultSaved::class,
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /** @return BelongsTo<AssessmentStep, $this> */
    public function assessmentStep(): BelongsTo
    {
        return $this->belongsTo(AssessmentStep::class);
    }

    /** @return BelongsTo<PoolCandidate, $this> */
    public function poolCandidate(): BelongsTo
    {
        return $this->belongsTo(PoolCandidate::class);
    }

    /** @return BelongsTo<PoolSkill, $this> */
    public function poolSkill(): BelongsTo
    {
        return $this->belongsTo(PoolSkill::class);
    }
}
