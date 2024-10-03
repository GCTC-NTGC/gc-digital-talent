<?php

namespace App\Rules;

use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AssessmentResultJustificationsConsistent implements ValidationRule
{
    private $assessmentResultType;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(?string $assessmentResultType)
    {
        $this->assessmentResultType = $assessmentResultType;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // ensure no skill justifications for education assessment types and the opposite
        if (
            $this->assessmentResultType === AssessmentResultType::EDUCATION->name &&
            count(
                array_intersect(
                    [
                        AssessmentResultJustification::SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED->name,
                    ],
                    $value
                )
            ) > 0
        ) {
            $fail('SkillJustificationsForEducationAssessment');
        }

        if (
            $this->assessmentResultType === AssessmentResultType::SKILL->name &&
            count(
                array_intersect(
                    [
                        AssessmentResultJustification::EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE->name,
                        AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION->name,
                        AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY->name,
                        AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name,
                        AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET->name,
                    ],
                    $value
                )
            ) > 0
        ) {
            $fail('EducationJustificationsForSkillAssessment');
        }
    }
}
