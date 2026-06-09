<?php

namespace App\GraphQL\Mutations;

use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TalentRequestTrackedUserMutator
{
    public function bulkCreateReferred($_, array $args): bool
    {
        $talentRequest = TalentRequest::findOrFail($args['talentRequestId']);
        $userIds = $args['userIds'];

        DB::transaction(function () use ($talentRequest, $userIds) {
            foreach ($userIds as $userId) {
                TalentRequestTrackedUser::updateOrCreate(
                    [
                        'talent_request_id' => $talentRequest->id,
                        'user_id' => $userId,
                    ],
                    [
                        'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
                        'not_referred_reason' => null,
                    ],
                );
            }
        });

        return true;
    }

    public function bulkCreateNotReferred($_, array $args): bool
    {
        $talentRequest = TalentRequest::findOrFail($args['talentRequestId']);
        $userIds = $args['userIds'];

        DB::transaction(function () use ($args, $talentRequest, $userIds) {
            foreach ($userIds as $userId) {
                TalentRequestTrackedUser::updateOrCreate(
                    [
                        'talent_request_id' => $talentRequest->id,
                        'user_id' => $userId,
                    ],
                    [
                        'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                        'not_referred_reason' => $args['notReferredReason'],
                        'selection_decision' => null,
                        'not_selected_reason' => null,
                    ],
                );
            }
        });

        return true;
    }

    public function bulkUpdateReferred($_, array $args): Collection
    {

        $trackedUsers = TalentRequestTrackedUser::whereIn('id', $args['ids'])->get();

        foreach ($trackedUsers as $trackedUser) {
            $trackedUser->referred();
        }

        return $trackedUsers;
    }

    public function bulkUpdateNotReferred($_, array $args): Collection
    {

        $trackedUsers = TalentRequestTrackedUser::whereIn('id', $args['ids'])->get();

        foreach ($trackedUsers as $trackedUser) {
            $trackedUser->notReferred($args['notReferredReason']);
        }

        return $trackedUsers;
    }

        public function bulkUpdateSelected($_, array $args): Collection
    {

        $trackedUsers = TalentRequestTrackedUser::whereIn('id', $args['ids'])->get();

        foreach ($trackedUsers as $trackedUser) {
            $trackedUser->selected();
        }

        return $trackedUsers;
    }

    public function bulkUpdateNotSelected($_, array $args): Collection
    {

        $trackedUsers = TalentRequestTrackedUser::whereIn('id', $args['ids'])->get();

        foreach ($trackedUsers as $trackedUser) {
            $trackedUser->notSelected($args['notSelectedReason']);
        }

        return $trackedUsers;
    }

}
