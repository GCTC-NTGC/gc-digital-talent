<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolStatus;
use App\Models\Pool;
use Illuminate\Support\Carbon;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class ArchivePool
{
    /**
     * Closes the pool by setting the archived_at to now().
     */
    public function __invoke($_, array $args)
    {
        /** @var Pool|null $pool */
        $pool = Pool::find($args['id']);
        if ($pool) {
            if ($pool->status !== PoolStatus::CLOSED->name) {
                throw ValidationException::withMessages(['id' => 'ArchivePoolInvalidStatus']);
            }
            $pool->update(['archived_at' => Carbon::now()]);
        }

        return $pool;
    }
}
