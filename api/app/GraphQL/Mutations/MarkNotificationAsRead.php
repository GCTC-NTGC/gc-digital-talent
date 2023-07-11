<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use App\Models\User;

final class MarkNotificationAsRead
{
    /**
     * Duplicates a pool
     *
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $notificationId = $args['id'];
        $userId = Auth::id();
        $notifications = User::find($userId)->notifications()->get();
        $notification = $notifications->first(function ($n) use ($notificationId) {
            return $n->id === $notificationId;
        });
        if (!is_null($notification)) {
            $notification->markAsRead();
            User::enrichNotification($notification);
            return $notification;
        }
    }
}
