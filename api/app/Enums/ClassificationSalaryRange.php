<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ClassificationSalaryRange
{
    use HasLocalization;

    case BETWEEN_0_39999;
    case BETWEEN_40000_59999;
    case BETWEEN_60000_79999;
    case BETWEEN_80000_99999;
    case BETWEEN_100000_119999;
    case OVER_120000;

    public static function getLangFilename(): string
    {
        return 'classification_salary_range';
    }
}
