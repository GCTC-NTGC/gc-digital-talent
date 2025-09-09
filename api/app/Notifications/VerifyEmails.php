<?php

namespace App\Notifications;

use App\Enums\EmailType;
use App\Enums\Language;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Error;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Cache;

// based on Illuminate\Auth\Notifications\VerifyEmail.php
class VerifyEmails extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    public string $emailAddress;

    /** @var EmailType[] */
    public array $emailTypes;

    /**
     * Create a new notification instance.
     *
     * @param  EmailType[]  $emailTypes  The types of email addresses to update on the user.
     * @param  string  $emailAddress  The new email addresses to set on the user.
     */
    public function __construct(string $emailAddress, array $emailTypes)
    {
        $this->emailAddress = $emailAddress;
        $this->emailTypes = $emailTypes;
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
            if (Language::EN->localeMatches($locale)) {
                $templateId = config('notify.templates.verify_email_en');
            } else {
                $templateId = config('notify.templates.verify_email_fr');
            }

            $message = new GcNotifyEmailMessage(
                $templateId,
                $this->emailAddress,
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
        $key = 'email-verification-'.$user->id;

        $randomizer = new \Random\Randomizer();
        $code = $randomizer->getBytesFromString('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

        $token = [
            'code' => $code,
            'field' => $this->emailTypes,
            'value' => $this->emailAddress,
        ];
        Cache::put($key, $token, now()->addHours(2));

        return $code;
    }
}
