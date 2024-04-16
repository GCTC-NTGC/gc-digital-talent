<?php

namespace Tests;

use Illuminate\Support\Facades\Request;

trait UsesProtectedRequestContext
{
    protected function setUpUsesProtectedRequestContext(): void
    {
        // simulate all tests using protected request context
        Request::merge(['isProtectedRequest' => true]);
    }
}
