<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\ErrorCode;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Models\TalentRequestTrackedUser;
use Exception;

final class UpdateTalentRequestTrackedUser
{
    public function __invoke($_, array $args): TalentRequestTrackedUser
    {
        $trackedUser = TalentRequestTrackedUser::findOrFail($args['id']);
        $referralDecision = $args['referral_decision'] ?? null;
        $notReferredReason = $args['not_referred_reason'] ?? null;
        $selectionDecision = $args['selection_decision'] ?? null;
        $notSelectedReason = $args['not_selected_reason'] ?? null;

        match (true) {
            $referralDecision === TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name => $trackedUser->notReferred($notReferredReason),
            $selectionDecision === TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name => $trackedUser->notSelected($notSelectedReason),
            $selectionDecision === TalentRequestTrackedUserSelectionDecision::SELECTED->name => $trackedUser->selected(),
            $referralDecision === TalentRequestTrackedUserReferralDecision::REFERRED->name => $trackedUser->referred(),
            default => throw new Exception(ErrorCode::TRACKED_USER_DECISION_COMBINATION_INVALID->name),
        };

        return $trackedUser;
    }
}
