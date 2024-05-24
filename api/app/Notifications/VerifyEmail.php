<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Error;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Cache;

// based on Illuminate\Auth\Notifications\VerifyEmail.php
class VerifyEmail extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [GcNotifyEmailChannel::class];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();
        $verificationCode = $this->createVerificationCode($notifiable);

        if ($locale == Language::EN->value) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.verify_email_en'),
                $notifiable->getEmailForVerification(),
                [
                    'verification code' => $verificationCode,
                ]
            );
        } else {
            throw new Error('Not implemented');
        }

        return $message;
    }

    /**
     * Get the verification code for the given notifiable.
     *
     * @param  App\Models\User  $notifiable
     * @return string
     */
    protected function createVerificationCode(User $notifiable)
    {
        $token = [
            'user_id' => $notifiable->id,
            'field' => 'email',
            'value' => $notifiable->getEmailForVerification(),
        ];

        $expirySeconds = 60 * 60 * 6;
        $wasStored = false;
        $code = (string) null;

        for ($attemptNumber = 0; $attemptNumber < 4; $attemptNumber++) {
            $code = random_int(1000, 9999);
            $key = 'email-verification-'.$code;
            $wasStored = Cache::add($key, $token, $expirySeconds);
            if ($wasStored) {
                break;
            }
        }

        if (! $wasStored || is_null($code)) {
            throw new Error('Failed to store token');
        }

        return $code;
    }
}
