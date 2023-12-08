<?php

namespace App\GraphQL\Mutations;

use App\Jobs\DemoJob;
use Illuminate\Support\Facades\Auth;

final class CreateDemoJobRequest
{
    public function __invoke($_, array $args)
    {
        $currentUserId = Auth::id();

        DemoJob::dispatch($args['delaySeconds'], $args['magicWord'], $currentUserId);

        return true;
    }
}
