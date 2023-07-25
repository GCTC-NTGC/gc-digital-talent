<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Error;
use Illuminate\Support\Carbon;

final class ArchivePool
{
    /**
     * Closes the pool by setting the archived_at to now().
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);
        $pool->update(['archived_at' => Carbon::now()]);
        return $pool;
    }
}
