<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestTrackedUserNotReferredReason
{
    use HasLocalization;

    case MISMATCH_IN_QUALIFICATIONS;
    case JOB_MISMATCHES_EXPECTATIONS;
    case TOO_MANY_CANDIDATES;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'talent_request_tracked_user_not_referred_reason';
    }
}
