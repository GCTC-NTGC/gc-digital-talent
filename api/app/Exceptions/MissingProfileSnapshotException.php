<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Facades\Log;

final class MissingProfileSnapshotException extends Exception
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }

    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
        Log::debug($this->getMessage());
    }
}
