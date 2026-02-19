<?php

namespace App\Services;

use App\Contracts\ManagedIdentityService;

// pretends to get tokens from Azure for testing
class DummyManagedIdentityService implements ManagedIdentityService
{
    public function getAccessToken(): string
    {
        return 'X';
    }
}
