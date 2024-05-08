<?php

namespace App\Notifications;

use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TalentRequestSubmissionConfirmation extends Notification implements CanBeSentViaGcNotifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $trackingNumber,
    ) {
    }

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
        } elseif ($notifiable instanceof User) {
            $message = new GcNotifyEmailMessage(
                $templateId,
                $notifiable->email,
                [
                    'tracking number' => $this->trackingNumber,
                    'requestor name' => $notifiable->first_name.' '.$notifiable->last_name,
                ]
            );
        } else {
            Log::error('Could not notify notifiable of type '.get_class($notifiable));
        }

        return $message;
    }
}
