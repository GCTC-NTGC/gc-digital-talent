<?php

namespace App\ValueObjects;

/**
 * What a LoginProvider hands back once it has identified the user.
 */
final readonly class LoginResult
{
    /**
     * @param  array<string, mixed>  $claims  describe the user, e.g. sub, email and locale
     * @param  array<string, mixed>  $tokens  passed to the frontend as query parameters
     */
    public function __construct(
        public array $claims,
        public array $tokens,
    ) {}
}
