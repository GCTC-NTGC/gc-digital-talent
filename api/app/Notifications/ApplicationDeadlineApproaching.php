<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class ApplicationDeadlineApproaching extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Carbon $closingDate,
        public string $opportunityTitleEn,
        public string $opportunityTitleFr,
        public string $poolAdvertisementLinkEn,
        public string $poolAdvertisementLinkFr,
        public string $applicationLinkEn,
        public string $applicationLinkFr,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // todo, check the settings attached to the user to decide
        return ['database', GcNotifyEmailChannel::class];
    }

    /**
     * Get the array representation of the notification.
     * https://laravel.com/docs/10.x/notifications#formatting-database-notifications
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'closingDate' => $this->closingDate,
            'opportunityTitle' => [
                'en' => $this->opportunityTitleEn,
                'fr' => $this->opportunityTitleFr,
            ],
            'poolAdvertisementLink' => [
                'en' => $this->poolAdvertisementLinkEn,
                'fr' => $this->poolAdvertisementLinkFr,
            ],
            'applicationLinkEn' => [
                'en' => $this->applicationLinkEn,
                'fr' => $this->applicationLinkFr,
            ],
        ];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): array
    {
        $locale = $this->locale ?? $notifiable->preferredLocale();
        $localizedClosingDateString = Carbon::executeWithLocale($locale,
            fn () => $this->closingDate->translatedFormat('F j, Y')
        );

        if ($locale == Language::EN->value) {
            // English notification
            $payload = [
                'template_id' => config('notify.templates.application_deadline_approaching_en'),
                'email_address' => $notifiable->email,
                'message_variables' => [
                    'closing date' => $localizedClosingDateString,
                    'opportunity title' => $this->opportunityTitleEn,
                    'pool advertisement link' => $this->poolAdvertisementLinkEn,
                    'application link' => $this->applicationLinkEn,
                ],
            ];
        } else {
            // French notification
            $payload = [
                'template_id' => config('notify.templates.application_deadline_approaching_fr'),
                'email_address' => $notifiable->email,
                'message_variables' => [
                    'closing date' => $localizedClosingDateString,
                    'opportunity title' => $this->opportunityTitleFr,
                    'pool advertisement link' => $this->poolAdvertisementLinkFr,
                    'application link' => $this->applicationLinkFr,
                ],
            ];
        }

        return $payload;
    }
}
