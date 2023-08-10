<?php

namespace App\GraphQL\Mutations;

use App\Models\ExperienceSkill;
use App\Models\UserSkill;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class CreateUserSkill
{
    /**
     * Create a UserSkill model or restore it
     * @param  null  $_
     * @param  array{}  $args
     * @return UserSkill
     */
    public function __invoke($_, array $args)
    {
        // check if the model exists accounting for trashed and then restore or error out, if not found proceed to create
        $existingModel = UserSkill::where('user_id', $args['user_id'])
            ->where('skill_id', $args['skill_id'])
            ->withTrashed()
            ->first();
        if ($existingModel !== null) {
            if (($existingModel->deleted_at !== null)) {
                $existingModel->restore();
                ExperienceSkill::where('user_skill_id', $existingModel->id)->restore(); // restore records on experience_skill
                return $existingModel;
            }
            throw ValidationException::withMessages(["DuplicateUserSkill"]);
        }

        $createdModel = UserSkill::create([
            'user_id' => $args['user_id'],
            'skill_id' => $args['skill_id'],
            'skill_level' => isset($args['skill_level']) ? $args['skill_level'] : null,
            'when_skill_used' => isset($args['when_skill_used']) ? $args['when_skill_used'] : null,
        ]);

        return $createdModel;
    }
}
