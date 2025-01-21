<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CourseLanguage
{
    use HasLocalization;

    case ENGLISH;
    case FRENCH;
    case BILINGUAL;

    public static function getLangFilename(): string
    {
        return 'course_language';
    }
}
