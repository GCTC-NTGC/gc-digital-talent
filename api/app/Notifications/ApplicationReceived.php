<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationReceived extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $applicantEmail,
        public string $applicantName,
        public string $poolNameEn,
        public string $poolNameFr,
        public string $poolCandidateId,
        public string $applicantPreferredLocale,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // email-only notification
        return [GcNotifyEmailChannel::class];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(object $notifiable): GcNotifyEmailMessage
    {
        $locale = $this->locale ?? $this->applicantPreferredLocale;

        if (Language::EN->localeMatches($locale)) {
            // English notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_received_en'),
                $this->applicantEmail,
                [
                    'applicant name' => $this->applicantName,
                    'opportunity title' => $this->poolNameEn,
                    'application ID number' => $this->poolCandidateId,
                    'applicant dashboard link' => config('app.url').'/en/applicant'
                ]
            );
        } else {
            // French notification
            $message = new GcNotifyEmailMessage(
                config('notify.templates.application_received_fr'),
                $notifiable->applicantEmail,
                [
                    'applicant name' => $this->applicantName,
                    'opportunity title' => $this->poolNameFr,
                    'application ID number' => $this->poolCandidateId,
                    'applicant dashboard link' => config('app.url').'/en/applicant'
                ]
            );
        }

        return $message;
    }
}
