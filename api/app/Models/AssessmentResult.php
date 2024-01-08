<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class AssessmentResult
 *
 * @property string $id
 * @property string $assessment_step_id
 * @property string $pool_candidate_id
 * @property string $pool_skill_id
 * @property string $assessment_result_type
 * @property string $assessment_decision
 * @property array $justifications
 * @property string $other_justification_notes
 * @property string $assessment_decision_level
 * @property string $skill_decision_notes
 * @property string $assessment_notes
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class AssessmentResult extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'justifications' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [];

    public function assessmentStep(): BelongsTo
    {
        return $this->belongsTo(AssessmentStep::class);
    }

    public function poolCandidate(): BelongsTo
    {
        return $this->belongsTo(PoolCandidate::class);
    }

    public function poolSkill(): BelongsTo
    {
        return $this->belongsTo(PoolSkill::class);
    }
}
