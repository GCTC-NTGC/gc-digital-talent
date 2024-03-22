<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class UpdateIgnoredNotifications
{
    /**
     * Updates the requesting users ignored notification families
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::find(Auth::id());

        if (isset($args['ignoredEmailNotifications'])) {
            $user->ignored_email_notifications = $args['ignoredEmailNotifications'];
        }
        if (isset($args['ignoredInAppNotifications'])) {
            $user->ignored_in_app_notifications = $args['ignoredInAppNotifications'];
        }

        $user->save();

        return $user;
    }
}
