<?php

namespace App\GraphQL\Queries;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

final class CanMigrateMyAccount
{
    public function __invoke()
    {
        /** @var User | null */
        $actor = Auth::user();

        /*
         * pre-check fail-fast
         */

        // if feature flag not enabled, then can't migrate
        if (! config('feature.auth_in_app_migration')) {
            return false;
        }

        // if no actor defined, then can't migrate
        if (is_null($actor)) {
            return false;
        }

        /*
         * core logic
         */

        $possibleTargetCount = User::query()->whereIsPossibleMigrationTarget(
            $actor->id,
            $actor->email,
            $actor->telephone
        )->count();

        // can migrate if there is exactly one possible match
        if ($possibleTargetCount == 1) {
            return true;
        }

        /*
         * fall through
         */
        return false;
    }
}
