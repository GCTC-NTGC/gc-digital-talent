<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class ApiKeyNotFoundException extends Exception
{
    /**
     * Report the exception.
     *
     * @return bool|null
     */
    public function report()
    {
        Log::debug('API key not found.');
    }
}
