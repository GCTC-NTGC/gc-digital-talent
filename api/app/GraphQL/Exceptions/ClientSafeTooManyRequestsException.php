<?php

declare(strict_types=1);

namespace App\GraphQL\Exceptions;

use GraphQL\Error\ClientAware;
use GraphQL\Error\ProvidesExtensions;

class ClientSafeTooManyRequestsException extends \Exception implements ClientAware, ProvidesExtensions
{
    public const KEY = 'too_many_requests';

    public function __construct(
        string $message,
        protected int $remainingSeconds,
    ) {
        parent::__construct($message);
    }

    /**
     * Returns true when exception message is safe to be displayed to a client.
     */
    public function isClientSafe(): bool
    {
        return true;
    }

    /**
     * Data to include within the "extensions" key of the formatted error.
     *
     * @return array<string, mixed>
     */
    public function getExtensions(): array
    {
        return [
            self::KEY => [
                'remaining_seconds' => $this->remainingSeconds,
            ],
        ];
    }
}
