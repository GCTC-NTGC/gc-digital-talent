<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Carbon\Carbon;
use Error;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

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
        $verificationUrl = $this->verificationUrl($notifiable);

        if ($locale == Language::EN->value) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.verify_email_en'),
                $notifiable->getEmailForVerification(),
                [
                    'verification link' => config('app.url').$verificationUrl,
                ]
            );
        } else {
            throw new Error('Not implemented');
        }

        return $message;
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  App\Models\User  $notifiable
     * @return string
     */
    protected function verificationUrl(User $notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify_email',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
