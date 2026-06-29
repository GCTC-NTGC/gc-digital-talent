<?php

namespace App\Contracts;

use App\Models\User;

interface SubscriptionNotification
{
    /**
     * Get the consistent array structure for the GraphQL Subscription 'data' field.
     *
     * @return array<string, mixed>
     */
    public function toSubscriptionArray(User $user): array;
}
