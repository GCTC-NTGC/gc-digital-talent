<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Error;

final class RestorePool
{
    /**
     * Closes the pool by setting the archived_at to now().
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);
        if ($pool->getStatusAttribute() !== ApiEnums::POOL_IS_ARCHIVED) {
            throw new Error("You cannot restore a pool unless it is in the archived status.");
        }
        $pool->update(['archived_at' => null]);
        return $pool;
    }
}
