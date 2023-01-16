<?php

namespace App\Notify;

use Illuminate\Support\Facades\Facade;

class NotifyFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'gcnotify';
    }
}
