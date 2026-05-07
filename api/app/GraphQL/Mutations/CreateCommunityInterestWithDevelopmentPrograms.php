<?php

namespace App\GraphQL\Mutations;

use App\Models\CommunityInterest;
use App\Models\DevelopmentProgramUser;
use Illuminate\Support\Facades\DB;

final class CreateCommunityInterestWithDevelopmentPrograms
{
    /**
     * Handle creating a community interest plus development programs
     */
    public function __invoke($_, array $args)
    {
        $userId = $args['user_id'];
        $communityInterestInput = $args['communityInterest'];
        $developmentProgramUserInput = array_key_exists('developmentPrograms', $args) ? $args['developmentPrograms'] : [];

        // combine all mutating in a transaction
        DB::beginTransaction();

        try {
            // start with the community interest
            $communityInterest = CommunityInterest::create(
                [
                    'community_id' => $communityInterestInput['community_id'],
                    'user_id' => $userId,
                    'job_interest' => $communityInterestInput['job_interest'] ?? null,
                    'training_interest' => $communityInterestInput['training_interest'] ?? null,
                    'additional_information' => $communityInterestInput['additional_information'] ?? null,
                    'finance_is_chief' => $communityInterestInput['finance_is_chief'] ?? null,
                    'additional_duties' => $communityInterestInput['additional_duties'] ?? null,
                    'finance_other_roles' => $communityInterestInput['finance_other_roles'] ?? null,
                    'finance_other_roles_other' => $communityInterestInput['finance_other_roles_other'] ?? null,
                    'consent_to_share_profile' => $communityInterestInput['consent_to_share_profile'] ?? null,
                    'procurement_is_sdo' => $communityInterestInput['procurement_is_sdo'] ?? null,
                ],
            );

            // sync the workstreams relation if applicable
            if (
                array_key_exists('workStreams', $communityInterestInput) &&
                array_key_exists('sync', $communityInterestInput['workStreams'])
            ) {
                $communityInterest->workStreams()->sync($communityInterestInput['workStreams']['sync']);
            }

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

            // commit all together
            DB::commit();

        } catch (\Throwable $error) {

            // rollback and error
            DB::rollBack();
            throw $error;
        }

        return $communityInterest;
    }
}
