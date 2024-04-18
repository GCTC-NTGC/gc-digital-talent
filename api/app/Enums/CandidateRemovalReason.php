<?php

namespace App\Enums;

enum CandidateRemovalReason
{
    case REQUESTED_TO_BE_WITHDRAWN;
    case NOT_RESPONSIVE;
    case OTHER;
}
