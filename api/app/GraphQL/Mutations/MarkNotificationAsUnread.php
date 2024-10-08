<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class MarkNotificationAsUnread
{
    /**
     * Mark a specific notification as unread
     */
    public function __invoke($_, array $args)
    {
        $notificationId = $args['id'];
        $user = User::find(Auth::id());
        $notification = $user
            ->notifications()
            ->firstWhere('id', $notificationId);

        if (! is_null($notification)) {
            $notification->markAsUnread();

            return $notification;
        }
    }
}
