<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum DepartmentSize
{
    use HasLocalization;

    case MICRO;
    case SMALL;
    case MEDIUM;
    case LARGE;

    public static function getLangFilename(): string
    {
        return 'department_size';
    }
}
