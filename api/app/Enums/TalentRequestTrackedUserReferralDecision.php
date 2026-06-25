<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestTrackedUserReferralDecision
{
    use HasLocalization;

    case REFERRED;
    case NOT_REFERRED;

    public static function getLangFilename(): string
    {
        return 'talent_request_tracked_user_referral_decision';
    }
}
