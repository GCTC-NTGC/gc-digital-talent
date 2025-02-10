<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

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

            $values = [
                'removed_at' => null,
                'final_decision_at' => null,
                'placed_at' => null,
            ];

            $timestamp = match ($status) {
                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name => 'final_decision_at',

                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                PoolCandidateStatus::REMOVED->name => 'removed_at',

                PoolCandidateStatus::PLACED_TENTATIVE->name,
                PoolCandidateStatus::PLACED_CASUAL->name,
                PoolCandidateStatus::PLACED_TERM->name,
                PoolCandidateStatus::PLACED_INDETERMINATE->name => 'placed_at',

                default => null// no-op
            };

            if ($timestamp) {
                $values[$timestamp] = now();
            }

            $values['pool_candidate_status'] = $status;

        }

        if (isset($args['expiry_date'])) {
            $values['expiry_date'] = $args['expiry_date'];
        }

        $candidate->update($values);
        $candidate->refresh();

        return $candidate;
    }
}
