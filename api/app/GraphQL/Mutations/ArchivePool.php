<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Illuminate\Support\Carbon;
use Nuwave\Lighthouse\Exceptions\ValidationException;

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
        if ($pool->getStatusAttribute() !== ApiEnums::POOL_IS_CLOSED) {
            throw ValidationException::withMessages(["You cannot archive a pool unless it is in the closed status."]);
        }
        $pool->update(['archived_at' => Carbon::now()]);
        return $pool;
    }
}
