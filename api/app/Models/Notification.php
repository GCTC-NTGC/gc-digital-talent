<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification;

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
}
