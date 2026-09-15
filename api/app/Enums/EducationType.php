<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EducationType
{
    use HasLocalization;

    case DEGREE_DIPLOMA_CERTIFICATE;
    case LICENSE_ACCREDITATION;
    case PROFESSIONAL_CERTIFICATION;
    case INDIVIDUAL_COURSE;
    case FELLOWSHIP;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'education_type';
    }
}
