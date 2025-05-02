<?php

namespace App\Notifications;

use App\Enums\EmailType;
use App\Enums\Language;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Error;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Cache;

// based on Illuminate\Auth\Notifications\VerifyEmail.php
class VerifyEmail extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    public EmailType $emailType;

    /**
     * Create a new notification instance.
     */
    public function __construct(EmailType $emailType)
    {
        $this->emailType = $emailType;
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
    public function toGcNotifyEmail(object $notifiable): GcNotifyEmailMessage
    {
        if ($notifiable instanceof User) {
            $locale = $this->locale ?? $notifiable->preferredLocale();
            if ($locale == strtolower(Language::EN->name)) {
                $templateId = config('notify.templates.verify_email_en');
            } else {
                $templateId = config('notify.templates.verify_email_fr');
            }

            $email = $notifiable->getEmailForVerification($this->emailType);
            if (! $email) {
                throw new Exception('Email type '.$this->emailType->name.' not set');
            }

            $message = new GcNotifyEmailMessage(
                $templateId,
                $email,
                [
                    'person name' => $notifiable->first_name,
                    'verification code' => $this->createVerificationCode($notifiable),
                ]
            );

            return $message;
        } else {
            throw new Error('Not implemented');
        }
    }

    /**
     * Get the verification code for the given notifiable.
     *
     * @return string
     */
    protected function createVerificationCode(User $user)
    {
        $key = $this->emailType->name.'-email-verification-'.$user->id;

        // once we get to PHP 8.3 this will provide a larger codespace using all the alphabetical chars:
        // Random\Randomizer::getBytesFromString('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

        $bytes = random_bytes(3); // three bytes = six hex chars
        $code = strtoupper(bin2hex($bytes));

        $token = [
            'code' => $code,
            'field' => $this->emailType->value,
            'value' => $user->getEmailForVerification($this->emailType),
        ];
        Cache::put($key, $token, now()->addHours(2));

        return $code;
    }
}
