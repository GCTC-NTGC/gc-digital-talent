<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EducationStatus
{
    use HasLocalization;

    case SUCCESS_CREDENTIAL;
    case SUCCESS_NO_CREDENTIAL;
    case IN_PROGRESS;
    case AUDITED; // No longer selectable
    case DID_NOT_COMPLETE;
    case SUCCESS; // Credential irrelevant

    public static function getLangFilename(): string
    {
        return 'education_status';
    }
}
