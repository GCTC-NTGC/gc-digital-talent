<?php

namespace App\GraphQL\Mutations;

use App\Jobs\DemoJob;
use App\Models\DemoRequest;

final class CreateDemoJobRequest
{
    public function __invoke($_, array $args)
    {
        $request = DemoRequest::create([
            'delay_seconds' => $args['delaySeconds'],
            'magic_word' => $args['magicWord'],
        ]);

        DemoJob::dispatch($request);

        return true;
    }
}
