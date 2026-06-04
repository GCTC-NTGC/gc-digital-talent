<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestPositionType
{
    use HasLocalization;

    case INDIVIDUAL_CONTRIBUTOR;
    case TEAM_LEAD;

    public static function getLangFilename(): string
    {
        return 'talent_request_position_type';
    }
}
