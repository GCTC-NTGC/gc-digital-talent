<?php

namespace App\Contracts;

interface ClientAuthenticationService
{
    /**
     * The OAuth client authentication parameters (per oauth.client_auth_method) to merge
     * into a token-endpoint-family request body (token, refresh, introspection, etc.)
     * authenticating this app as the OAuth client to the given endpoint.
     *
     * @return array<string, string>
     */
    public function paramsFor(string $audience): array;
}
