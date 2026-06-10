<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateTrackedUsersNotReferredValidator extends Validator
{
    public function rules(): array
    {
        return [
            'userIds' => ['required', 'array', 'min:1'],
            'userIds.*' => ['required', 'uuid', 'distinct', 'exists:users,id'],
            'talentRequestId' => ['required', 'uuid', 'exists:talent_requests,id'],
            'notReferredReason' => [
                'required',
                Rule::in(array_column(TalentRequestTrackedUserNotReferredReason::cases(), 'name')),
            ],
        ];
    }
}
