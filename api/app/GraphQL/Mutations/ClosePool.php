<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Illuminate\Support\Carbon;

final class ClosePool
{
    /**
     * Closes the pool by setting the closing_date to now().
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);
        $pool->update([
            'closing_date' => Carbon::now(),
            'closing_reason' => isset($args['closing_reason']) ? $args['closing_reason'] : null,
        ]);

        return $pool;
    }
}
