<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EmploymentCategory
{
    use HasLocalization;

    case EXTERNAL_ORGANIZATION;
    case GOVERNMENT_OF_CANADA;
    case CANADIAN_ARMED_FORCES;

    public static function getLangFilename(): string
    {
        return 'employment_category';
    }
}
