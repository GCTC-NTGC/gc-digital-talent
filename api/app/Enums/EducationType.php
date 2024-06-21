<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EducationType
{
    use HasLocalization;

    case DIPLOMA;
    case BACHELORS_DEGREE;
    case MASTERS_DEGREE;
    case PHD;
    case POST_DOCTORAL_FELLOWSHIP;
    case ONLINE_COURSE;
    case CERTIFICATION;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'education_type';
    }
}
