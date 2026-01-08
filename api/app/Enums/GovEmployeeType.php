<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum GovEmployeeType
{
    use HasLocalization;

    case STUDENT;
    case CASUAL;
    case TERM;
    case INDETERMINATE;
    case CONTRACTOR;

    public static function getLangFilename(): string
    {
        return 'gov_employee_type';
    }
}
