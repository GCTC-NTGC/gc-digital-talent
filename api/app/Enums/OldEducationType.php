<?php

namespace App\Enums;

use App\Traits\HasLocalization;

// Replaced by EducationType - used in V1 snapshots
enum OldEducationType
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
        return 'old_education_type';
    }
}
