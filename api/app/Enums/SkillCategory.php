<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum SkillCategory
{
    use HasLocalization;

    case TECHNICAL;
    case BEHAVIOURAL;

    public static function getLangFilename(): string
    {
        return 'skill_category';
    }
}
