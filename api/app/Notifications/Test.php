<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Test Notification
 *
 * Used for PPH unit testing graphql operations
 */
class Test extends Notification
{
    use Queueable;

    private $data;

    public function __construct(?string $data)
    {
        $this->data = $data;
    }

    public function via(object $notifiable)
    {
        return ['database'];
    }

    public function toArray(object $notifiable)
    {
        return ['data' => $this->data];
    }
}
