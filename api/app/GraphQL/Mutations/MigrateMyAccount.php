<?php

namespace App\GraphQL\Mutations;

use App\Enums\ErrorCode;
use App\Models\User;
use GraphQL\Error\Error;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\AuthorizationException;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class MigrateMyAccount
{
    /**
     * Migrates the current user to a different user by swapping sub values.
     */
    public function __invoke(mixed $_, array $args)
    {
        /** @var User|null $actor */
        $actor = User::find(Auth::id());

        /**
         * pre-check fail-fast
         */

        // if feature flag not enabled, then can't migrate
        if (! config('feature.auth_in_app_migration')) {
            throw new Error('Feature is not enabled.');
        }

        // if no actor defined, then can't migrate
        if (is_null($actor)) {
            throw new AuthorizationException();
        }

        // if actor is missing email, or telephone, then can't migrate
        if (is_null($actor->email) || is_null($actor->telephone)) {
            throw ValidationException::withMessages(['id' => ErrorCode::MIGRATION_MISSING_CONTACT_INFO->name]);
        }

        /**
         * core logic
         */

        /** @var Collection<int, User> $possibleTargets */
        $possibleTargets = User::query()->whereIsPossibleMigrationTarget(
            $actor->id,
            $actor->email,
            $actor->telephone
        )->get();

        // happy path: one possible migration target so let's do it
        if ($possibleTargets->count() === 1) {
            $target = $possibleTargets->sole();

            $subToTransfer = $actor->sub;
            $subToOverwrite = $target->sub;

            DB::transaction(function () use ($actor, $target, $subToTransfer) {
                // clear our current account
                $actor->sub = null;
                $actor->email_backup = $actor->email;
                $actor->email = null;
                $actor->work_email_backup = $actor->work_email;
                $actor->work_email = null;
                $actor->save();
                $actor->deleteOrFail();

                // set our sub on the target account
                $target->sub = $subToTransfer;
                $target->save();
            });

            Log::info('Account migration complete', [
                'originating user ID' => $actor->id,
                'target user ID' => $target->id,
                'transferred sub' => $subToTransfer,
                'overwritten sub' => $subToOverwrite,
            ]);

            return true;
        }

        throw ValidationException::withMessages(['id' => ErrorCode::MIGRATION_TARGET_NOT_FOUND->name]);
    }
}
