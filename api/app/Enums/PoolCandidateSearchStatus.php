<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolCandidateSearchStatus
{
    use HasLocalization;

    case NEW;
    case IN_PROGRESS;
    case WAITING;
    case DONE;
    case DONE_NO_CANDIDATES;
    case NOT_COMPLIANT;

    public static function getLangFilename(): string
    {
        return 'pool_candidate_search_status';
    }
}
