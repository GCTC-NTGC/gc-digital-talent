<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateStatus
{
    use HasLocalization;

    // Pre-submission
    case DRAFT;
    case EXPIRED;

    // Assessments
    case RECEIVED;
    case UNDER_REVIEW;
    case APPLICATION_REVIEWED;
    case UNDER_ASSESSMENT;

    // Post-assessment
    case UNSUCCESSFUL;
    case QUALIFIED;

    // Removed
    case WITHDREW;
    case NOT_RESPONSIVE;
    case INELIGIBLE;
    case REMOVED;

    public static function getLangFilename(): string
    {
        return 'candidate_status';
    }
}
