<?php

namespace App\Services;

use App\Contracts\ManagedIdentityService;

// pretends to get tokens from a service for testing
class DummyManagedIdentityService implements ManagedIdentityService
{
    public function getAccessToken(): string
    {
        return 'X';
    }
}
