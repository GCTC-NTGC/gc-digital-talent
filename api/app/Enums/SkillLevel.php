<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum SkillLevel
{
    use HasLocalization;

    case BEGINNER;
    case INTERMEDIATE;
    case ADVANCED;
    case LEAD;

    public static function getLangFilename(): string
    {
        return 'skill_level';
    }
}
