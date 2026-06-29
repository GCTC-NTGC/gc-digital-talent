<?php

namespace App\Services;

use App\Contracts\ManagedIdentityService;

/* Fake managed identity service for testing */
class DummyManagedIdentityService implements ManagedIdentityService
{
    public function getAccessToken(): string
    {
        return 'X';
    }
}
