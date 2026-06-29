<?php

namespace App\GraphQL\Mutations;

use App\Enums\ApplicationStatus;
use App\Models\PoolCandidate;
use Exception;

final class CreateSpecialApplication
{
    /**
     * Create a special application
     */
    public function __invoke($_, array $args)
    {
        $poolCandidateInput = $args;
        $poolId = $poolCandidateInput['pool']['connect'];
        $userId = $poolCandidateInput['user']['connect'];

        $existingPoolCandidate = PoolCandidate::where('pool_id', $poolId)
            ->where('user_id', $userId)
            ->withTrashed()
            ->first();

        // branch one
        // pool candidate exists
        if ($existingPoolCandidate) {
            if ($existingPoolCandidate->submitted_at) {
                // should not reach as this is checked in validation, but double-checking regardless
                throw new Exception('PROBLEM: Exception reached in CreateSpecialApplication');
            }

            $existingPoolCandidate->update([
                'special_application_type' => $poolCandidateInput['special_application_type'],
                'special_application_justification' => $poolCandidateInput['special_application_justification'],
                'special_application_closing_date' => $poolCandidateInput['special_application_closing_date'],
            ]);

            return $existingPoolCandidate;
        }

        // branch two
        // pool candidate to be created
        $createdApplication = PoolCandidate::create([
            'pool_id' => $poolId,
            'user_id' => $userId,
            'special_application_type' => $poolCandidateInput['special_application_type'],
            'special_application_justification' => $poolCandidateInput['special_application_justification'],
            'special_application_closing_date' => $poolCandidateInput['special_application_closing_date'],
        ]);

        $createdApplication->application_status = ApplicationStatus::DRAFT->name;
        $createdApplication->save();
        $createdApplication->refresh();

        return $createdApplication;
    }
}
