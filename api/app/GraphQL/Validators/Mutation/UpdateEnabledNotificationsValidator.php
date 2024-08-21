<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ApiError;
use App\Enums\NotificationFamily;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateEnabledNotificationsValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        // only some notification families can be enabled
        $validFamilies = [NotificationFamily::APPLICATION_UPDATE->name, NotificationFamily::JOB_ALERT->name];

        return [
            'enabledEmailNotifications' => ['array'],
            'enabledEmailNotifications.*' => ['distinct', Rule::in($validFamilies)],
            'enabledInAppNotifications' => ['array'],
            'enabledInAppNotifications.*' => ['distinct', Rule::in($validFamilies)],
        ];
    }

    public function messages(): array
    {
        return [
            'in' => ApiError::NOTIFICATION_FAMILY_CANNOT_ENABLE->localizedErrorMessage(),
        ];
    }
}
