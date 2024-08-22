<?php

namespace App\GraphQL\Mutations;

use App\Enums\ApiError;
use App\Enums\PoolStatus;
use App\Models\Pool;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class UnarchivePool
{
    /**
     * Un-archives the pool by clearing the archived_at timestamp.
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);
        if ($pool->getStatusAttribute() !== PoolStatus::ARCHIVED->name) {
            throw ValidationException::withMessages([
                'status' => [ApiError::PROCESS_UNARCHIVE_INVALID_STATUS->localizedMessage()],
            ]);
        }
        $pool->update(['archived_at' => null]);

        return $pool;
    }
}
