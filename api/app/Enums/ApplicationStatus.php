<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ApplicationStatus
{
    use HasLocalization;

    case DRAFT;
    case TO_ASSESS;
    case REMOVED;
    case DISQUALIFIED;
    case QUALIFIED;

    public static function getLangFilename(): string
    {
        return 'application_status';
    }
}
