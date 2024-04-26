<?php

namespace App\Notifications;

use App\Models\User;

interface CanBeSentViaGcNotifyEmail
{
    public function toGcNotifyEmail(User $notifiable): array;
}
