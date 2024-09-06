<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolAreaOfSelection
{
    use HasLocalization;

    case PUBLIC;
    case EMPLOYEES;

    public static function getLangFilename(): string
    {
        return 'pool_area_of_selection';
    }
}
