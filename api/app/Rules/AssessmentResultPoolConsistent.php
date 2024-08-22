<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\AssessmentStep;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AssessmentResultPoolConsistent implements ValidationRule
{
    private $parentAssessmentStep;

    private $parentPoolCandidate;

    private $parentPoolSkill;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(string $parentAssessmentStep, string $parentPoolCandidate, ?string $parentPoolSkill)
    {
        $this->parentAssessmentStep = AssessmentStep::find($parentAssessmentStep);
        $this->parentPoolCandidate = PoolCandidate::find($parentPoolCandidate);
        $this->parentPoolSkill = $parentPoolSkill ? PoolSkill::find($parentPoolSkill) : null;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // test in one place that the three belongsTo relations correctly connect to one pool
        // pool skill relation is nullable

        if ($this->parentPoolSkill) {
            if (
                ! (
                    $this->parentAssessmentStep->pool_id === $this->parentPoolCandidate->pool_id &&
                    $this->parentAssessmentStep->pool_id === $this->parentPoolSkill->pool_id)
            ) {
                $fail(ApiError::ASSESSMENT_STEP_REFERENCES_MULTIPLE_POOLS->localizedMessage());
            }
        } elseif (
            ! ($this->parentAssessmentStep->pool_id === $this->parentPoolCandidate->pool_id)
        ) {
            $fail(ApiError::ASSESSMENT_STEP_REFERENCES_MULTIPLE_POOLS->localizedMessage());
        }
    }
}
