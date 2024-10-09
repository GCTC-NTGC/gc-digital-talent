<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class MarkAllNotificationsAsRead
{
    /**
     * Mark all unread notifications as read
     */
    public function __invoke($_, array $args)
    {
        $user = User::find(Auth::id());
        $user
            ->unreadNotifications
            ->markAsRead();

        return $user->notifications;
    }
}
