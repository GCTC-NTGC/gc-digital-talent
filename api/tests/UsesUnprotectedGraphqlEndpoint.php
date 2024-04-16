<?php

namespace Tests;

use Illuminate\Support\Facades\Config;

trait UsesUnprotectedGraphqlEndpoint
{
    protected function setUpUsesUnprotectedGraphqlEndpoint(): void
    {
        // simulate all tests using unprotected (regular) endpoint
        Config::set('lighthouse.route.name', 'graphql');
    }
}
