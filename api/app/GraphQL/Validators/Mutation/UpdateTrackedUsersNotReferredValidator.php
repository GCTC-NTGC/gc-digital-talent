<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTrackedUsersNotReferredValidator extends Validator
{
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid', 'distinct', 'exists:talent_request_tracked_users,id'],
            'notReferredReason' => [
                'required',
                Rule::in(array_column(TalentRequestTrackedUserNotReferredReason::cases(), 'name')),
            ],
        ];
    }
}
