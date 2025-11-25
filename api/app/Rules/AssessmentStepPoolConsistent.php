<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\AssessmentStep;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AssessmentStepPoolConsistent implements ValidationRule
{
    private $parentAssessmentStep;

    private $parentPoolCandidate;

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
                $fail(ErrorCode::ASSESSMENT_RESULT_REFERENCES_MULTIPLE_POOLS->name);
            }
        } elseif (
            ! ($this->parentAssessmentStep->pool_id === $this->parentPoolCandidate->pool_id)
        ) {
            $fail(ErrorCode::ASSESSMENT_RESULT_REFERENCES_MULTIPLE_POOLS->name);
        }
    }
}
