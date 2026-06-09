<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTrackedUsersNotSelectedValidator extends Validator
{
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'uuid', 'distinct', 'exists:talent_request_tracked_users,id'],
            'notSelectedReason' => [
                'required',
                Rule::in(array_column(TalentRequestTrackedUserNotSelectedReason::cases(), 'name')),
            ],
        ];
    }
}
