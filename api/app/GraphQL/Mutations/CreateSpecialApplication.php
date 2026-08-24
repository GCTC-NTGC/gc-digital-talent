<?php

namespace App\GraphQL\Mutations;

use App\Enums\ActivityEvent;
use App\Enums\ApplicationStatus;
use App\Enums\SpecialApplicationType;
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
        $specialApplicationLocalizedString = SpecialApplicationType::localizedString($poolCandidateInput['special_application_type']);

        $specialApplicationFields = [
            'special_application_type' => $poolCandidateInput['special_application_type'],
            'special_application_justification' => $poolCandidateInput['special_application_justification'],
            'special_application_closing_date' => $poolCandidateInput['special_application_closing_date'],
        ];

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

            // suppress the automatic update log; withoutLogging re-enables even if the update throws
            activity()->withoutLogging(function () use ($existingPoolCandidate, $specialApplicationFields) {
                $existingPoolCandidate->update($specialApplicationFields);
            });

            $existingPoolCandidate->logActivity(ActivityEvent::SPECIAL_APPLICATION_CREATED, [
                'user_id' => $userId,
                ...$specialApplicationFields,
                'special_application_type_en' => $specialApplicationLocalizedString['en'],
                'special_application_type_fr' => $specialApplicationLocalizedString['fr'],
            ]);

            return $existingPoolCandidate;
        }

        // branch two
        // pool candidate to be created
        // suppress the automatic create/save logs; withoutLogging re-enables even if a write throws
        $createdApplication = activity()->withoutLogging(function () use ($poolId, $userId, $specialApplicationFields) {
            $application = PoolCandidate::create([
                'pool_id' => $poolId,
                'user_id' => $userId,
                ...$specialApplicationFields,
            ]);

            $application->application_status = ApplicationStatus::DRAFT->name;
            $application->save();
            $application->refresh();

            return $application;
        });

        $createdApplication->logActivity(ActivityEvent::SPECIAL_APPLICATION_CREATED, [
            'user_id' => $userId,
            'application_status' => ApplicationStatus::DRAFT->name,
            ...$specialApplicationFields,
            'special_application_type_en' => $specialApplicationLocalizedString['en'],
            'special_application_type_fr' => $specialApplicationLocalizedString['fr'],
        ]);

        return $createdApplication;
    }
}
