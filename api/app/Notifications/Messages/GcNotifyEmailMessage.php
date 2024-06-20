<?php

namespace App\Notifications\Messages;

class GcNotifyEmailMessage
{
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(
        public string $templateId,
        public string $emailAddress,
        public array $messageVariables) {}
}
