<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;

/**
 * Class Notification
 *
 * Note: Exists for lighthouse-php pagination
 */
class Notification extends DatabaseNotification
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function getAttribute($key)
    {

        if (isset($this->attributes['data'])) {
            $data = json_decode($this->attributes['data'], true);
            if (array_key_exists($key, $data)) {
                return $data[$key];
            }
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

    public function scopeAuthorizedToView(Builder $query): void
    {

        /** @var \App\Models\User */
        $user = Auth::user();

        if (! is_null($user?->id)) {
            $query->where('notifiable_id', $user->id);

            return;
        }

        $query->where('notifiable_id', null);
    }
}
