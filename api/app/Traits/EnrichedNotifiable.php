<?php

namespace App\Traits;

use App\Models\Notification;
use Illuminate\Notifications\Notifiable;

trait EnrichedNotifiable
{
    use Notifiable;

    /**
     * Get custom enriched notifications
     */
    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable')
            ->latest();
    }
}
