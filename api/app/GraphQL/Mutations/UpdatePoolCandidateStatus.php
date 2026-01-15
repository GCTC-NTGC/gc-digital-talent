<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\FinalDecision;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;

final readonly class UpdatePoolCandidateStatus
{
    public function __invoke(null $_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $values = [];

        if (isset($args['pool_candidate_status']) && $args['pool_candidate_status'] !== $candidate->pool_candidate_status) {
            $status = $args['pool_candidate_status'];

            $now = now();
            $values = [
                'removed_at' => null,
                'final_decision_at' => null,
                'placed_at' => null,
            ];

            $timestamps = match ($status) {
                PoolCandidateStatus::EXPIRED->name,
                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
                PoolCandidateStatus::UNDER_CONSIDERATION->name,
                PoolCandidateStatus::PLACED_TENTATIVE->name,
                PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name => ['final_decision_at'],

                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::REMOVED->name => ['removed_at'],

                PoolCandidateStatus::PLACED_CASUAL->name,
                PoolCandidateStatus::PLACED_TERM->name,
                PoolCandidateStatus::PLACED_INDETERMINATE->name => ['placed_at', 'final_decision_at'],

                default => null// no-op
            };

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

            if ($timestamps) {
                foreach ($timestamps as $timestamp) {
                    $values[$timestamp] = $now;
                }
            }

            if ($status === PoolCandidateStatus::QUALIFIED_WITHDREW->name) {
                $values['suspended_at'] = $now;
            }

            $values['pool_candidate_status'] = $status;
            $values['computed_final_decision'] = $finalDecision;

        }

        if (isset($args['expiry_date'])) {
            $values['expiry_date'] = $args['expiry_date'];
        }

        $candidate->update($values);
        $candidate->refresh();

        return $candidate;
    }
}
