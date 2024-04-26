<?php

namespace App\Notifications;

use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;

interface CanBeSentViaGcNotifyEmail
{
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage;
}
