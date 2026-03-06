<?php

namespace App\Contracts;

/* Applications can use managed identities to obtain tokens without having to manage any credentials. */
interface ManagedIdentityService
{
    public function getAccessToken(): string;
}
