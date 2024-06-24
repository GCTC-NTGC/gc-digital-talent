<?php

namespace App\Notifications;

use App\Notifications\Messages\GcNotifyEmailMessage;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Notification;

class TalentRequestSubmissionConfirmation extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $trackingNumber,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(): array
    {
        return [GcNotifyEmailChannel::class];
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(object $notifiable): GcNotifyEmailMessage
    {
        // bilingual notification
        $templateId = config('notify.templates.talent_request_submission_confirmation_enfr');

        if ($notifiable instanceof AnonymousNotifiable) {
            $routingInfo = $notifiable->routeNotificationFor(GcNotifyEmailChannel::class);
            $message = new GcNotifyEmailMessage(
                $templateId,
                $routingInfo['email address'],
                [
                    'tracking number' => $this->trackingNumber,
                    'requestor name' => $routingInfo['requestor name'],
                ]
            );
        } else {
            throw new Exception('Not implemented');
        }

        return $message;
    }
}
