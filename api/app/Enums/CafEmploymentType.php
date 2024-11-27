<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CafEmploymentType
{
    use HasLocalization;

    case REGULAR_FORCE;
    case RESERVE_FORCE;

    public static function getLangFilename(): string
    {
        return 'caf_employment_type';
    }
}
