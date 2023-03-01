<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Database\Helpers\ApiEnums;

class RoleSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'role:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Laratrust roles to existing users.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $baseUserRole = Role::where('name', 'base_user')->sole();
        $applicantRole = Role::where('name', 'applicant')->sole();
        $poolOperatorRole = Role::where('name', 'pool_operator')->sole();
        $requestResponderRole = Role::where('name', 'request_responder')->sole();
        $superAdminRole = Role::where('name', 'platform_admin')->sole();

        $DCMTeam = Team::where('name', 'digital-community-management')
            ->sole();

        $users = User::all();

        foreach ($users as $user) {
            // Everyone gets the base roles :)
            $rolesToSync = [$baseUserRole, $applicantRole];

            $user->syncRoles($rolesToSync);

            // Add admin roles if user has the legacy admin role
            if (in_array(ApiEnums::ROLE_ADMIN, $user->legacy_roles)) {
                array_push($rolesToSync, $requestResponderRole, $superAdminRole);

                // Attach the pool_operator role to DCM team
                $user->attachRole($poolOperatorRole, $DCMTeam);
            }
        }

        return Command::SUCCESS;
    }
}
