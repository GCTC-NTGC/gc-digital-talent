<?php

namespace App\Enums;

use App\Traits\HasLocalization;
enum LearningOpportunitiesInterest
{
    use HasLocalization;

    case INTERCHANGE;
    case ACADEMIC_PROGRAM;
    case PEER_NETWORKING;
    case PROFESSIONAL_ACCREDITATION;

    public static function getLangFilename(): string
    {
        return 'learning_opportunities_interest';
    }
}
