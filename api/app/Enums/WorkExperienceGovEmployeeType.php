<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum WorkExperienceGovEmployeeType
{
    use HasLocalization;

    case STUDENT;
    case CASUAL;
    case TERM;
    case INDETERMINATE;
    case CONTRACTOR;

    public static function getLangFilename(): string
    {
        return 'work_experience_gov_employee_type';
    }
}
