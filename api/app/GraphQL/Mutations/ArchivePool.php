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
        $pool = Pool::find($args['id']);
        if ($pool->getStatusAttribute() !== PoolStatus::CLOSED->name) {
            throw ValidationException::withMessages(['ArchivePoolInvalidStatus']);
        }
        $pool->update(['archived_at' => Carbon::now()]);

        return $pool;
    }
}
