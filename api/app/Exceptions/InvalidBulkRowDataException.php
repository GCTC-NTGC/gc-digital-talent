<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class InvalidBulkRowDataException extends Exception
{
    /**
     * Report the exception.
     *
     * @return bool|null
     */
    public function report()
    {
        Log::debug("Bulk \$rows data is invalid.");
    }
}
