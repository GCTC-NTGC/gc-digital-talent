<?php

namespace App\Services;

use App\Contracts\KeyService;

/* Interact with an Azure key vault. */
class LocalKeyService implements KeyService
{
    /* Get a list of keys */
    public function getKeys(): ?string
    {
        return 'hello world';
    }
}
