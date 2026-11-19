<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
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
        // work email notifications are opt-in for every family, including system messages
        $validWorkEmailFamilies = array_column(NotificationFamily::cases(), 'name');

        return [
            'enabledEmailNotifications' => ['array'],
            'enabledEmailNotifications.*' => ['distinct', Rule::in($validFamilies)],
            'enabledInAppNotifications' => ['array'],
            'enabledInAppNotifications.*' => ['distinct', Rule::in($validFamilies)],
            'enabledWorkEmailNotifications' => ['array'],
            'enabledWorkEmailNotifications.*' => ['distinct', Rule::in($validWorkEmailFamilies)],
        ];
    }

    public function messages(): array
    {
        return [
            'in' => ErrorCode::CANNOT_ENABLE_NOTIFICATION_FAMILY->name,
        ];
    }
}
