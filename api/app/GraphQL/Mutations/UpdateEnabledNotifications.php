<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            // TODO: check for employee status if setting to true
            $user->enabled_work_email_notifications = $args['enabledWorkEmailNotifications'];
        }

        $user->save();

        return $user;
    }
}
