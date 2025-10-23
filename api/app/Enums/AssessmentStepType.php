<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use GraphQL\Type\Definition\Description;

enum AssessmentStepType
{
    use HasLocalization;

    case SCREENING_QUESTIONS_AT_APPLICATION;
    #[Description(description: 'Automatically controlled depending on the existence of screening questions on a pool.')]
    case TECHNICAL_EXAM_AT_SITE;
    case TECHNICAL_EXAM_AT_HOME;
    case PSC_EXAM;
    case INTERVIEW_GROUP;
    case INTERVIEW_INDIVIDUAL;
    case INTERVIEW_FOLLOWUP;
    case REFERENCE_CHECK;
    case APPLICATION_SCREENING;
    #[Description(description: 'Every pool has this step automatically upon creation.')]
    case ADDITIONAL_ASSESSMENT;

    public static function getLangFilename(): string
    {
        return 'assessment_step_type';
    }

    // Some step types are controlled and will cause the sort_order to snap to a new value when saving.
    // These step types are free to use use, starting in step_order 3.
    public static function uncontrolledStepTypes(): array
    {
        return [
            AssessmentStepType::TECHNICAL_EXAM_AT_SITE,
            AssessmentStepType::TECHNICAL_EXAM_AT_HOME,
            AssessmentStepType::PSC_EXAM,
            AssessmentStepType::INTERVIEW_GROUP,
            AssessmentStepType::INTERVIEW_INDIVIDUAL,
            AssessmentStepType::INTERVIEW_FOLLOWUP,
            AssessmentStepType::REFERENCE_CHECK,
            AssessmentStepType::ADDITIONAL_ASSESSMENT,
        ];
    }
}
