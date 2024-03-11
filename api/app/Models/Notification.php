<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;

/**
 * Class Notification
 *
 * Note: Exists for lighthouse-php pagination
 */
class Notification extends DatabaseNotification
{
    public function getAttribute($key)
    {

        $data = json_decode($this->attributes['data'], true);
        if (array_key_exists($key, $data)) {
            return $data[$key];
        }

        return parent::getAttribute($key);
    }

    public function scopeOnlyUnread(Builder $query, ?bool $onlyUnread)
    {
        if (! $onlyUnread) {
            return $query;
        }

        return $query->whereNull('read_at');
    }

    public function scopeAuthorizedToView(Builder $query)
    {

        /** @var \App\Models\User */
        $user = Auth::user();

        if (! $user) {
            return $query->where('notifiable_id', null);
        }

        $query->where('notifiable_id', $user->id);

        return $query;
    }
}
