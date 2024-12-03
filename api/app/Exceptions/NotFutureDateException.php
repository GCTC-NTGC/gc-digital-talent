<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class NotFutureDateException extends Exception
{
    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
        Log::debug('The send date must be in the future.');
    }
}
