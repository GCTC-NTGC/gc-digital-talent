<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class NotFutureDateException extends Exception
{
        /**
     * Report the exception.
     *
     * @return bool|null
     */
    public function report()
    {
        Log::debug("The date must be in the future");
    }
}
