<?php

namespace App\GraphQL\Mutations;

use App\Jobs\DemoJob;

final class CreateDemoJobRequest
{
    public function __invoke($_, array $args)
    {
        DemoJob::dispatch($args['delaySeconds'], $args['magicWord']);

        return true;
    }
}
