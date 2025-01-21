<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

class EmailAttachmentException extends Exception
{
    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
        Log::debug('Error with the attachment file.');
    }
}
