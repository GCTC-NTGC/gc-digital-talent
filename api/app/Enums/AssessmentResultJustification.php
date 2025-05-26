<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum AssessmentResultJustification
{
    use HasLocalization;

    case EDUCATION_ACCEPTED_INFORMATION;
    case EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY;
    case EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE;
    case EDUCATION_FAILED_NOT_RELEVANT;
    case EDUCATION_FAILED_REQUIREMENT_NOT_MET;
    case SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED;
    case FAILED_NOT_ENOUGH_INFORMATION;
    case FAILED_OTHER;

    public static function educationJustifications(): array
    {
        return [
            AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION,
            AssessmentResultJustification::EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE,
            AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY,
            AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT,
            AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET,
            AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION,
            AssessmentResultJustification::FAILED_OTHER,
        ];
    }

    public static function skillJustifications(): array
    {
        return [
            AssessmentResultJustification::SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED,
            AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION,
            AssessmentResultJustification::FAILED_OTHER,
        ];
    }

    public static function educationJustificationsSuccess(): array
    {
        return [
            AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION,
            AssessmentResultJustification::EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE,
            AssessmentResultJustification::EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY,
        ];
    }

    public static function educationJustificationsFailure(): array
    {
        return [
            AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT,
            AssessmentResultJustification::EDUCATION_FAILED_REQUIREMENT_NOT_MET,
            AssessmentResultJustification::FAILED_NOT_ENOUGH_INFORMATION,
            AssessmentResultJustification::FAILED_OTHER,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'assessment_result_justification';
    }
}
