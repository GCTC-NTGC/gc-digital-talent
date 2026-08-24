<?php

namespace App\GraphQL\Mutations;

use App\Enums\CommunityReferralStatus;
use App\Models\CommunityInterest;

final class UpdateCommunityInterestReferralStatus
{
    /**
     * Handle updating a community interest referral status
     */
    public function __invoke($_, array $args)
    {
        $communityInterest = CommunityInterest::findOrFail($args['id']);
        $status = $args['status'] ?? CommunityReferralStatus::NEW->name;
        $isAvailable = $status === CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name;
        $classification = $args['classification'] ?? [];

        $communityInterest->referral_status = $status;
        $communityInterest->referral_follow_up_date = $args['followUpDate'] ?? null;
        $communityInterest->referral_notes = $args['notes'] ?? null;
        $communityInterest->referral_status_data_updated_at = now();

        if (! $isAvailable || ($classification['disconnect'] ?? false)) {
            $communityInterest->referralClassification()->dissociate();
        }

        if ($connect = ($classification['connect'] ?? null)) {
            $communityInterest->referralClassification()->associate($connect);
        }

        if ($status === CommunityReferralStatus::NOT_REFERRED->name) {
            $communityInterest->referral_follow_up_date = null;
        }

        $communityInterest->save();

        return $communityInterest;
    }
}
