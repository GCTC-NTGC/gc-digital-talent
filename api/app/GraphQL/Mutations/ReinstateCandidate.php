<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Exception;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class ReinstateCandidate
{
    /**
     * Marks a candidate as removed from the pool
     */
    public function __invoke($_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);

        try {
            $candidate->reinstate();
        } catch (Exception $e) {
            throw ValidationException::withMessages(['id' => $e->getMessage()]);
        }

        return $candidate;
    }
}
