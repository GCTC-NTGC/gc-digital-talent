<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class ChangePoolClosingDate
{
    /**
     * Extends the pools closing date.
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);
        $newClosingDate = $args['closingDate'];

        $pool->update([
            'closing_date' => $newClosingDate,
            'closing_reason' => null,
        ]);

        return $pool;
    }
}
