<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CommunityReferralStatus
{
    use HasLocalization;

    case NEW;
    case PENDING;
    case AVAILABLE_FOR_REFERRAL;
    case NOT_REFERRED;

    public static function getLangFilename(): string
    {
        return 'community_referral_status';
    }
}
