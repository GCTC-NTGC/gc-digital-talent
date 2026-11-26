<?php

namespace App\GraphQL\Mutations;

use App\Enums\ErrorCode;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

final class UpdateEnabledNotifications
{
    /**
     * Updates the requesting users enabled notification families
     */
    public function __invoke($_, array $args)
    {
        $user = User::find(Auth::id());

        if (isset($args['enabledEmailNotifications'])) {
            $user->enabled_email_notifications = $args['enabledEmailNotifications'];
        }
        if (isset($args['enabledInAppNotifications'])) {
            $user->enabled_in_app_notifications = $args['enabledInAppNotifications'];
        }
        if (isset($args['enabledWorkEmailNotifications'])) {
            throw_if(count($args['enabledWorkEmailNotifications']) > 0 && ! $user->has_a_verified_work_email_address,
                ValidationException::withMessages(['code' => ErrorCode::NEED_VERIFIED_WORK_EMAIL->name]));

            $user->enabled_work_email_notifications = $args['enabledWorkEmailNotifications'];
        }

        $user->save();

        return $user;
    }
}
