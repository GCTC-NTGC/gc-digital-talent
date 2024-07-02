<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EducationRequirementOption
{
    use HasLocalization;

    case APPLIED_WORK;
    case EDUCATION;
    case PROFESSIONAL_DESIGNATION;

    public static function getLangFilename(): string
    {
        return 'education_requirement';
    }
}
