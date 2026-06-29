<?php

namespace App\GraphQL\Subscriptions;

use App\Models\User;
use Illuminate\Http\Request;
use Nuwave\Lighthouse\Schema\Types\GraphQLSubscription;
use Nuwave\Lighthouse\Subscriptions\Subscriber;

class NotificationReceived extends GraphQLSubscription
{
    public function authorize(Subscriber $subscriber, Request $request): bool
    {
        $user = $subscriber->context->user();

        return $user instanceof User;
    }

    public function filter(Subscriber $subscriber, mixed $root): bool
    {
        /** @var ?User $user */
        $user = $subscriber->context->user();

        if (! $user instanceof User) {
            return false;
        }

        return $root?->user_id === $user->id;
    }
}
