<?php

namespace App\GraphQL\Mutations;

use App\Models\CommunityInterest;
use App\Models\DevelopmentProgramUser;

final class UpdateCommunityInterestWithDevelopmentPrograms
{
    /**
     * Handle updating a community interest plus development programs
     */
    public function __invoke($_, array $args)
    {
        $communityInterestId = $args['id'];
        $communityInterestInput = $args['communityInterest'];
        $developmentProgramUserInput = array_key_exists('developmentPrograms', $args) ? $args['developmentPrograms'] : [];

        $communityInterest = CommunityInterest::findOrFail($communityInterestId);
        $userId = $communityInterest->user_id;

        // update values only if an input key is present
        if (array_key_exists('job_interest', $communityInterestInput)) {
            $communityInterest->job_interest = $communityInterestInput['job_interest'];
        }
        if (array_key_exists('training_interest', $communityInterestInput)) {
            $communityInterest->training_interest = $communityInterestInput['training_interest'];
        }
        if (array_key_exists('additional_information', $communityInterestInput)) {
            $communityInterest->additional_information = $communityInterestInput['additional_information'];
        }
        if (array_key_exists('finance_is_chief', $communityInterestInput)) {
            $communityInterest->finance_is_chief = $communityInterestInput['finance_is_chief'];
        }
        if (array_key_exists('finance_additional_duties', $communityInterestInput)) {
            $communityInterest->finance_additional_duties = $communityInterestInput['finance_additional_duties'];
        }
        if (array_key_exists('finance_other_roles', $communityInterestInput)) {
            $communityInterest->finance_other_roles = $communityInterestInput['finance_other_roles'];
        }
        if (array_key_exists('finance_other_roles_other', $communityInterestInput)) {
            $communityInterest->finance_other_roles_other = $communityInterestInput['finance_other_roles_other'];
        }
        if (array_key_exists('consent_to_share_profile', $communityInterestInput)) {
            $communityInterest->consent_to_share_profile = $communityInterestInput['consent_to_share_profile'];
        }

        // sync the workstreams relation if applicable
        if (
            array_key_exists('workStreams', $communityInterestInput) &&
            array_key_exists('sync', $communityInterestInput['workStreams'])
        ) {
            $communityInterest->workStreams()->sync($communityInterestInput['workStreams']['sync']);
        }

        // save and refresh the model
        $communityInterest->save();
        $communityInterest->refresh();

        // next the development programs
        foreach ($developmentProgramUserInput as $input) {
            DevelopmentProgramUser::updateOrCreate(
                [
                    'development_program_id' => $input['development_program_id'],
                    'user_id' => $userId,
                ],
                [
                    'education_experience_id' => $input['education_experience_id'] ?? null,
                    'participation_status' => $input['participation_status'] ?? null,
                    'completion_date' => $input['completion_date'] ?? null,
                ]
            );
        }

        return $communityInterest;
    }
}
