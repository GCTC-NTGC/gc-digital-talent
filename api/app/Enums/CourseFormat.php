<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CourseFormat
{
    use HasLocalization;

    case ON_SITE;
    case VIRTUAL;

    public static function getLangFilename(): string
    {
        return 'course_format';
    }
}
