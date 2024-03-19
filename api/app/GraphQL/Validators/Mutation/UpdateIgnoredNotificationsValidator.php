<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\NotificationFamily;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateIgnoredNotificationsValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        // only some notification families can be ignored
        $validFamilies = [NotificationFamily::APPLICATION_UPDATE->name, NotificationFamily::JOB_ALERT->name];

        return [
            'ignoredEmailNotifications' => ['nullable', 'array'],
            'ignoredEmailNotifications.*' => ['distinct', Rule::in($validFamilies)],
            'ignoredInAppNotifications' => ['nullable', 'array'],
            'ignoredInAppNotifications.*' => ['distinct', Rule::in($validFamilies)],
        ];
    }

    public function messages(): array
    {
        return [
            'in' => 'NotIgnorableNotificationFamily',
        ];
    }
}
