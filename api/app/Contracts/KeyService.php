<?php

namespace App\Contracts;

/* A service to provide keys */
interface KeyService
{
    public function getKeys(): ?string;
}
