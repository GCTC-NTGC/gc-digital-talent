<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use App\Models\User;

final class TogglePoolUserBookmark
{
    /**
     * Toggles a user's bookmarked pool
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['pool_id']);
        $user = User::find($args['user_id']);
        $user->poolBookmarks()->toggle($pool->id);

        return $pool;
    }
}
