<?php

namespace App\GraphQL\Mutations;

use App\Enums\CandidateRemovalReason;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Illuminate\Support\Carbon;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class RemoveCandidate
{
    /**
     * Marks a candidate as removed from the pool
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        $candidate->removed_at = Carbon::now();
        $candidate->removal_reason = $args['removalReason'];
        if ($args['removalReason'] === CandidateRemovalReason::OTHER->name) {
            $candidate->removal_reason_other = $args['removalReasonOther'];
        }

        // Update the candidates status based on the current status
        // or throw an error if the candidate is already placed or removed
        switch ($candidate->pool_candidate_status) {
            case PoolCandidateStatus::SCREENED_OUT_APPLICATION->name:
            case PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name:
                $candidate->pool_candidate_status = PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name;
                break;
            case PoolCandidateStatus::QUALIFIED_AVAILABLE->name:
            case PoolCandidateStatus::EXPIRED->name:
                $candidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name;
                break;
            case PoolCandidateStatus::NEW_APPLICATION->name:
            case PoolCandidateStatus::APPLICATION_REVIEW->name:
            case PoolCandidateStatus::SCREENED_IN->name:
            case PoolCandidateStatus::UNDER_ASSESSMENT->name:
                $candidate->pool_candidate_status = PoolCandidateStatus::REMOVED->name;
                break;
            case PoolCandidateStatus::PLACED_TENTATIVE->name:
            case PoolCandidateStatus::PLACED_CASUAL->name:
            case PoolCandidateStatus::PLACED_TERM->name:
            case PoolCandidateStatus::PLACED_INDETERMINATE->name:
                throw ValidationException::withMessages(['RemoveCandidateAlreadyPlaced']);
            case PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name:
            case PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name:
            case PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name:
            case PoolCandidateStatus::QUALIFIED_WITHDREW->name:
            case PoolCandidateStatus::REMOVED->name:
                throw ValidationException::withMessages(['RemoveCandidateAlreadyRemoved']);
            default:
                throw ValidationException::withMessages(['CandidateUnexpectedStatus']);
        }

        $candidate->save();

        return $candidate;
    }
}
