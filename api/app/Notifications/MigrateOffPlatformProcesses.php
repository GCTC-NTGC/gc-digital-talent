<?php

namespace App\Notifications;

use App\Enums\Language;
use App\Models\User;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MigrateOffPlatformProcesses extends Notification implements CanBeSentViaGcNotifyEmail
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
    public function via(User $_): array
    {
        // $notificationFamily = NotificationFamily::SYSTEM_MESSAGE->name;
        // Can't ignore system messages

        return   [ 'database', GcNotifyEmailChannel::class];
    }

    /**
     * Get the array representation of the notification.
     * https://laravel.com/docs/11.x/notifications#formatting-database-notifications
     *
     * @return array<string, mixed>
     */
    public function toArray(object $_): array
    {
         return []; // no customization to in-app message
    }

    /**
     * Get the GC Notify representation of the notification.
     */
    public function toGcNotifyEmail(User $notifiable): GcNotifyEmailMessage
    {
      $locale = $this->locale ?? $notifiable->preferredLocale();
      if (Language::EN->localeMatches($locale)) {
          // English notification
          $message = new GcNotifyEmailMessage(
              config('notify.templates.re-enter_off-platform_en'),
              $notifiable->email,
              [
                  'first name+last name' => $notifiable->full_name,
              ]
          );
      } else {
          // French notification
          $message = new GcNotifyEmailMessage(
              config('notify.templates.re-enter_off-platform_fr'),
              $notifiable->email,
              [
                  'first name+last name' => $notifiable->full_name,
              ]
          );
      }

      return $message;
    }
}
