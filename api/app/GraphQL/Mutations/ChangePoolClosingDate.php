<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class ChangePoolClosingDate
{
    /**
     * Extends the pools closing date.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);
        $pool->update(['closing_date' => $args['new_closing_date']]);
        return $pool;
    }
}
