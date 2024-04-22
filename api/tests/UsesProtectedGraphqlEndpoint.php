<?php

namespace Tests;

use Illuminate\Support\Facades\Config;

trait UsesProtectedGraphqlEndpoint
{
    protected function setUpUsesProtectedGraphqlEndpoint(): void
    {
        // simulate all tests using protected endpoint
        Config::set('lighthouse.route.name', 'graphql-protected');
    }
}
