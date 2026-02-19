<?php

namespace App\Contracts;

interface ManagedIdentityService
{
    public function getAccessToken(): string;
}
