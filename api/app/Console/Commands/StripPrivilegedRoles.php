<?php

namespace App\Console\Commands;

use App\Events\CommandProducedResults;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

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

        $users = User::query()
            ->whereHasRole(role: $privilegedRoleNames, boolean: 'or')
            ->where('last_sign_in_iss', 'is distinct from', $this->argument('current-iss'))
            ->get();

        if ($this->confirm('Do you want to strip privileged roles from '.$users->count().' users?')) {
            $progressBar = $this->output->createProgressBar($users->count());

            $users->each(function ($user) use ($progressBar, $privilegedRoleNames, &$usersUpdatedCount, &$rolesRemovedCount) {
                $assignmentsToRemove = $user->roleAssignments()
                    ->whereHas('role', fn ($subQuery) => $subQuery->whereIn('name', $privilegedRoleNames))
                    ->with(['role', 'team'])
                    ->get();

                $assignmentsToRemove->each(function (RoleAssignment $assignment) use (&$rolesRemovedCount, $user) {
                    $user->removeRole($assignment->role, $assignment->team);
                    $rolesRemovedCount++;
                });

                $usersUpdatedCount++;
                $progressBar->advance();
            });

            $this->info('');
            $this->info('Complete');
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
