<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum DegreeType
{
    use HasLocalization;

    case HIGH_SCHOOL;
    case COLLEGE_DIPLOMA;
    case BACHELORS_DEGREE;
    case MASTERS_DEGREE;
    case PHD;

    public static function getLangFilename(): string
    {
        return 'degree_type';
    }
}
