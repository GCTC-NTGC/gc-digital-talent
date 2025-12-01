<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Exception;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class RemoveCandidate
{
    /**
     * Marks a candidate as removed from the pool
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        try {
            $candidate->remove($args['reason'], $args['removalReason']);
        } catch (Exception $e) {
            throw ValidationException::withMessages(['id' => $e->getMessage()]);
        }

        $candidate->save();

        return $candidate;
    }
}
