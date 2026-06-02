<?php

namespace App\GraphQL\Mutations;

use App\Models\CommunityDevelopmentProgram;

final class CreateOrRestoreCommunityDevelopmentProgram
{
    /**
     * Create or restore an existing (soft deleted) record in pivot community_development_program
     */
    public function __invoke($_, array $args)
    {
        // non-nullable
        $communityId = $args['community_id'];
        $developmentProgramId = $args['development_program_id'];

        // this can be null
        $classificationsInput = array_key_exists('classifications', $args) ? $args['classifications'] : null;

        /** @var CommunityDevelopmentProgram | null $recordToReturn */
        $recordToReturn = null;

        // check first for a soft deleted record
        // if it exists, restore it
        $existingRecord =
            CommunityDevelopmentProgram::withTrashed()
                ->where('community_id', $communityId)
                ->where('development_program_id', $developmentProgramId)
                ->first();
        if ($existingRecord) {
            $existingRecord->restore();
            $existingRecord->refresh();

            $recordToReturn = $existingRecord;
        } else {

            // existing record does not exist
            // safe to create a pivot record
            $newRecord = CommunityDevelopmentProgram::create(
                [
                    'community_id' => $communityId,
                    'development_program_id' => $developmentProgramId,
                ]
            );

            $recordToReturn = $newRecord;
        }

        // conditionally sync classifications
        if (
            $classificationsInput &&
            array_key_exists('sync', $classificationsInput)
        ) {
            $recordToReturn->classifications()->sync($classificationsInput['sync']);
        }

        $recordToReturn->refresh();

        return $recordToReturn;
    }
}
