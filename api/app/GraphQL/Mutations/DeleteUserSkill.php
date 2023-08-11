<?php

namespace App\GraphQL\Mutations;

use App\Models\ExperienceSkill;
use App\Models\UserSkill;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class DeleteUserSkill
{
    /**
     * Soft delete a UserSkill model
     * @param  null  $_
     * @param  array{}  $args
     * @return UserSkill
     */
    public function __invoke($_, array $args)
    {
        $existingModel = UserSkill::find($args['id']);

        if ($existingModel === null) {
            throw ValidationException::withMessages(["UserSkillNotFound"]);
        }

        // soft delete all experience_skill records containing the model then soft delete the model
        ExperienceSkill::where('user_skill_id', $existingModel->id)->delete();
        $existingModel->delete();
    }
}
