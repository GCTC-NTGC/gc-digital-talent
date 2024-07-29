<?php

namespace App\Listeners;

use App\Events\UserFileGenerated;
use App\Models\User;
use App\Notifications\UserFileGenerated as NotificationsUserFileGenerated;

class SendFileGeneratedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(UserFileGenerated $event): void
    {
        $user = User::findOrFail($event->userId);
        $notification = new NotificationsUserFileGenerated($event->fileName);
        $user->notify($notification);
    }
}
