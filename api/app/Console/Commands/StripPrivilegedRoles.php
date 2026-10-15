<?php

namespace App\Console\Commands;

use App\Events\CommandProducedResults;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * WHEN TO RUN: Has to be run before we turn on our in-app migration tool (FEATURE_AUTH_IN_APP_MIGRATION).
 *
 * HOW LONG: We currently have 192 users in prod who will be updated so I don't expect it will take more than a few minutes.
 *
 * SAFE TO RERUN: Yes
 *
 * VERIFY SUCCESS: After running, confirm this returns 0:
 *
 * select count(*)
 * from users u
 * join role_user ru on ru.user_id  = u.id
 * join roles r on ru.role_id  = r.id
 * where r."name" not in ('guest', 'base_user', 'applicant')
 * and u.last_sign_in_iss is distinct from 'https://auth.login-connexion.canada.ca/oauth2'
 *
 * WHEN TO REMOVE: Once it has been run successfully once in production.
 */
#[Signature('app:strip-privileged-roles {current-iss=https://auth.login-connexion.canada.ca/oauth2}')]
#[Description('Removes all privileged roles from users who haven\'t migrated yet')]
class StripPrivilegedRoles extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $usersUpdatedCount = 0;
        $rolesRemovedCount = 0;

        $privilegedRoleNames = Role::query()
            ->whereNotIn('name', ['guest', 'base_user', 'applicant'])
            ->pluck('name')
            ->toArray();

        $users = User::withTrashed()
            ->whereHasRole($privilegedRoleNames)
            ->where('last_sign_in_iss', 'is distinct from', $this->argument('current-iss'))
            ->with(['roleAssignments' => fn ($query) => $query->whereHas('role', fn ($subQuery) => $subQuery->whereIn('name', $privilegedRoleNames))])
            ->get();

        if ($this->confirm('Do you want to strip privileged roles from '.$users->count().' users?')) {
            $progressBar = $this->output->createProgressBar($users->count());

            $users->each(function ($user) use ($progressBar, &$usersUpdatedCount, &$rolesRemovedCount) {
                $user->roleAssignments->each(function (RoleAssignment $assignment) use (&$rolesRemovedCount, $user) {
                    $user->removeRole(
                        ['id' => $assignment->role_id],
                        $assignment->team_id ? ['id' => $assignment->team_id] : null
                    );
                    $rolesRemovedCount++;
                });

                $usersUpdatedCount++;
                $progressBar->advance();
            });
            $progressBar->finish();

            $this->info(' Complete');
        } else {
            $this->info('Aborting');
        }

        $resultSet = [
            'Users updated' => $usersUpdatedCount,
            'Role assignments removed' => $rolesRemovedCount,
        ];
        CommandProducedResults::dispatch($this->getName(), $resultSet);
        $this->table(['Metric', 'Count'], collect($resultSet)->map(fn ($v, $k) => [$k, $v]));

        return $this::SUCCESS;
    }
}
