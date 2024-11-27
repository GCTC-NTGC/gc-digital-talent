<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CafRank
{
    use HasLocalization;

    case GENERAL_FLAG_OFFICER;
    case SENIOR_OFFICER;
    case JUNIOR_OFFICER;
    case SUBORDINATE_OFFICER;
    case WARRANT_PETTY_SENIOR_NCO;
    case JUNIOR_NON_COMMISSIONED;

    public static function getLangFilename(): string
    {
        return 'caf_rank';
    }
}
