<?php

namespace App\Enums;

enum PoolCandidateSearchRequestReason
{
    case IMMEDIATE_HIRE;
    case UPCOMING_NEED;
    case GENERAL_INTEREST;
    case REQUIRED_BY_DIRECTIVE;
}
