<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class TogglePoolUserBookmark
{
    /**
     * Toggles a user's bookmarked pool
     */
    public function __invoke($_, array $args)
    {
        /** @var User | null */
        $user = Auth::user();
        /** @var Pool */
        $pool = Pool::find($args['pool_id']);
        $user->poolBookmarks()->toggle($pool->id);

        return $pool;
    }
}
