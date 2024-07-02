<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolSkillType
{
    use HasLocalization;

    case ESSENTIAL;
    case NONESSENTIAL;

    public static function getLangFilename(): string
    {
        return 'pool_skill_type';
    }
}
