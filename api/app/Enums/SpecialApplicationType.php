<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum SpecialApplicationType
{
    use HasLocalization;

    case VETERAN;
    case PRIORITY;
    case MINISTERS_STAFF;
    case ACCOMMODATION;
    case TECHNICAL_SUPPORT;
    case PSC_REQUEST;
    case EMPLOYEE_CURRENTLY_ON_LEAVE;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'special_application_type';
    }
}
