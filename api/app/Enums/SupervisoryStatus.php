<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum SupervisoryStatus
{
    use HasLocalization;

    case INDIVIDUAL_CONTRIBUTOR;
    case SUPERVISOR;

    public static function getLangFilename(): string
    {
        return 'supervisory_status';
    }
}
