<?php

namespace App\GraphQL\Mutations;

use App\Enums\PoolStatus;
use App\Models\Pool;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class UnarchivePool
{
    /**
     * Un-archives the pool by clearing the archived_at timestamp.
     */
    public function __invoke($_, array $args)
    {
        /** @var Pool|null $pool */
        $pool = Pool::find($args['id']);
        if ($pool) {
            if ($pool->status !== PoolStatus::ARCHIVED->name) {
                throw ValidationException::withMessages(['status' => 'UnarchivePoolInvalidStatus']);
            }
            $pool->update(['archived_at' => null]);
        }

        return $pool;
    }
}
