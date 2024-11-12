<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum GovEmploymentType
{
    use HasLocalization;

    case STUDENT;
    case CASUAL;
    case TERM;
    case INDETERMINATE;
    case CONTRACTOR;

    public static function getLangFilename(): string
    {
        return 'gov_employment_type';
    }
}
