<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolCandidateSearchPositionType
{
    use HasLocalization;

    case INDIVIDUAL_CONTRIBUTOR;
    case TEAM_LEAD;

    public static function getLangFilename(): string
    {
        return 'pool_candidate_search_position_type';
    }
}
