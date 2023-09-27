<?php

namespace App\Enums;

enum AssessmentStepType
{
    case SCREENING_QUESTIONS_AT_APPLICATION;
    case TECHNICAL_EXAM_AT_SITE;
    case TECHNICAL_EXAM_AT_HOME;
    case PSC_EXAM;
    case INTERVIEW_GROUP;
    case INTERVIEW_INDIVIDUAL;
    case INTERVIEW_FOLLOWUP;
    case REFERENCE_CHECK;
    case ADDITIONAL_ASSESSMENT;
}
