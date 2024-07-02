<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EducationStatus
{
    use HasLocalization;

    case SUCCESS_CREDENTIAL;
    case SUCCESS_NO_CREDENTIAL;
    case IN_PROGRESS;
    case AUDITED;
    case DID_NOT_COMPLETE;

    public static function getLangFilename(): string
    {
        return 'education_status';
    }
}
