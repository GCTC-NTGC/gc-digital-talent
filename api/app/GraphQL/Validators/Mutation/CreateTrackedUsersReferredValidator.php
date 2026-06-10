<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use Nuwave\Lighthouse\Validation\Validator;

final class CreateTrackedUsersReferredValidator extends Validator
{
    public function rules(): array
    {
        return [
            'userIds' => ['required', 'array', 'min:1'],
            'userIds.*' => ['required', 'uuid', 'distinct', 'exists:users,id'],
            'talentRequestId' => ['required', 'uuid', 'exists:talent_requests,id'],
        ];
    }
}
