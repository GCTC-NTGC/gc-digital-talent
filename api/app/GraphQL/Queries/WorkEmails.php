<?php

namespace App\GraphQL\Queries;

use App\Models\User;

final class WorkEmails
{
    /**
     * @param  array<string, mixed>  $args
     *
     * @disregard P1003 We are not using this var
     */
    public function __invoke($_, array $args)
    {
        $search = $args['search'] ?? '';

        $results = User::select(['id', 'work_email'])
            ->whereWorkEmailIsVerified()
            ->whereWorkEmail($search)
            ->limit(10)
            ->get();

        return $results;
    }
}
