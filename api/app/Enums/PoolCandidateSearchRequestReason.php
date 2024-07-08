<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolCandidateSearchRequestReason
{
    use HasLocalization;

    case IMMEDIATE_HIRE;
    case UPCOMING_NEED;
    case GENERAL_INTEREST;
    case REQUIRED_BY_DIRECTIVE;

    public static function getLangFilename(): string
    {
        return 'pool_candidate_search_request_reason';
    }
}
