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

        // check first for a soft deleted record
        // if it exists, restore it, sync classifications conditionally, then return it
        // exit, do not create another record
        $existingRecord =
            CommunityDevelopmentProgram::withTrashed()
                ->where('community_id', $communityId)
                ->where('development_program_id', $developmentProgramId)
                ->first();
        if ($existingRecord && isset($existingRecord)) {
            $existingRecord->restore();

            if (
                $classificationsInput &&
                array_key_exists('sync', $classificationsInput)
            ) {
                $existingRecord->classifications()->sync($classificationsInput['sync']);
            }

            $existingRecord->refresh();

            return $existingRecord;
        }

        // existing record does not exist
        // safe to create a pivot record
        // then conditional sync before returning
        $newRecord = CommunityDevelopmentProgram::create(
            [
                'community_id' => $communityId,
                'development_program_id' => $developmentProgramId,
            ]
        );

        if (
            $classificationsInput &&
            array_key_exists('sync', $classificationsInput)
        ) {
            $newRecord->classifications()->sync($classificationsInput['sync']);
        }

        $newRecord->refresh();

        return $newRecord;
    }
}
