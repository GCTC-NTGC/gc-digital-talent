<?php

namespace App\GraphQL\Mutations;

use App\Enums\ApiError;
use App\Models\UserSkill;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class CreateUserSkill
{
    /**
     * Create a UserSkill model or restore it
     *
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

                // if restoring, persist new values if applicable
                $existingModel->update([
                    'skill_level' => isset($args['skill_level']) ? $args['skill_level'] : $existingModel->skill_level,
                    'when_skill_used' => isset($args['when_skill_used']) ? $args['when_skill_used'] : $existingModel->when_skill_used,
                ]);
                $existingModel->refresh();

                return $existingModel;
            }
            throw ValidationException::withMessages([
                'skill_id' => [ApiError::USER_SKILL_EXISTS->localizedErrorMessage()],
            ]);
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
