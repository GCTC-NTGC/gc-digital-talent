<?php

namespace App\GraphQL\Queries;

use App\Models\User;

final class CountTalentRequestMatches
{
    /**
     * @param  array<string, mixed>  $args
     *
     * @disregard P1003 We are not using this var
     */
    public function __invoke($_, array $args): int
    {
        return User::query()
            ->whereMatchesTalentRequest($args['where'] ?? [])
            ->count();
    }
}
