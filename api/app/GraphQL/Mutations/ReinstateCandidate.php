<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class ReinstateCandidate
{
    /**
     * Marks a candidate as removed from the pool
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        // Update the candidates status based on the current status
        // or throw an error if the candidate has an invalid status
        switch ($candidate->pool_candidate_status) {
            case PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name:
            case PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name:
                $candidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
                break;
            case PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name:
            case PoolCandidateStatus::QUALIFIED_WITHDREW->name:
                $candidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
                break;
            case PoolCandidateStatus::REMOVED->name:
                $candidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
                break;
            default:
                throw ValidationException::withMessages(['CandidateUnexpectedStatus']);
                break;
        }

        $candidate->removed_at = null;
        $candidate->removal_reason = null;
        $candidate->removal_reason_other = null;

        $candidate->save();

        return $candidate;
    }
}
