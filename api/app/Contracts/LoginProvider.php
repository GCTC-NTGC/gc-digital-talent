<?php

namespace App\Contracts;

use App\ValueObjects\LoginResult;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The system users log in through. AuthController handles what every login flow
 * shares, and the LoginProvider supplies the protocol-specific steps.
 */
interface LoginProvider
{
    /**
     * Begin a login, e.g. by redirecting to the identity provider or showing a login form.
     */
    public function startLogin(Request $request): Response;

    /**
     * Identify the user when they come back from startLogin().
     *
     * @throws HttpResponseException to end the login with that response instead
     */
    public function finishLogin(Request $request): LoginResult;

    /**
     * @return array<string, mixed>|null new tokens, or null if the refresh token was rejected
     */
    public function refresh(string $refreshToken): ?array;
}
