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

            $now = now();
            $values = [
                'placed_at' => null,
            ];

            $timestamps = match ($status) {
                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::REMOVED->name,
                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
                PoolCandidateStatus::UNDER_CONSIDERATION->name,
                PoolCandidateStatus::PLACED_TENTATIVE->name,
                PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name => ['status_updated_at'],

                PoolCandidateStatus::PLACED_CASUAL->name,
                PoolCandidateStatus::PLACED_TERM->name,
                PoolCandidateStatus::PLACED_INDETERMINATE->name => ['placed_at', 'status_updated_at'],

                default => null// no-op
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

        }

        if (isset($args['expiry_date'])) {
            $values['expiry_date'] = $args['expiry_date'];
        }

        $candidate->update($values);
        $candidate->refresh();

        return $candidate;
    }
}
