<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\ApplicationStatus;
use App\Enums\FinalDecision;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;

final readonly class UpdatePoolCandidateStatus
{
    public function __invoke(null $_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $values = [];

        if (isset($args['application_status']) && $args['application_status'] !== $candidate->application_status) {
            $status = $args['application_status'];

            $finalDecision = match ($status) {
                PoolCandidateStatus::NEW_APPLICATION->name,
                PoolCandidateStatus::APPLICATION_REVIEW->name,
                PoolCandidateStatus::SCREENED_IN->name,
                PoolCandidateStatus::UNDER_ASSESSMENT->name => FinalDecision::TO_ASSESS->name,

                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name => FinalDecision::DISQUALIFIED->name,

                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name => FinalDecision::QUALIFIED->name,

                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                PoolCandidateStatus::REMOVED->name => FinalDecision::REMOVED->name,

                PoolCandidateStatus::PLACED_TENTATIVE->name,
                PoolCandidateStatus::PLACED_CASUAL->name,
                PoolCandidateStatus::PLACED_TERM->name,
                PoolCandidateStatus::PLACED_INDETERMINATE->name => FinalDecision::QUALIFIED_PLACED->name,

                default => null
            };

            $legacyStatus = match ($status) {
                ApplicationStatus::DRAFT->name => PoolCandidateStatus::DRAFT->name,
                ApplicationStatus::TO_ASSESS->name => PoolCandidateStatus::NEW_APPLICATION->name,
                ApplicationStatus::DISQUALIFIED->name => ApplicationStatus::DISQUALIFIED->name,
                ApplicationStatus::QUALIFIED->name => ApplicationStatus::QUALIFIED->name,
                ApplicationStatus::REMOVED->name => ApplicationStatus::REMOVED->name,
                default => null
            };

            $values['status_updated_at'] = now();
            $values['computed_final_decision'] = $finalDecision;
            $values['application_status'] = $status;

            if ($legacyStatus) {
                $values['pool_candidate_status'] = $legacyStatus;
            }
        }

        if (isset($args['expiry_date'])) {
            $values['expiry_date'] = $args['expiry_date'];
        }

        $candidate->update($values);
        $candidate->refresh();

        return $candidate;
    }
}
