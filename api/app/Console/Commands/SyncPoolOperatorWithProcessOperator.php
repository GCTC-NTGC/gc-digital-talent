<?php

namespace App\Console\Commands;

use App\Models\Pool;
use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Console\Command;

class SyncPoolOperatorWithProcessOperator extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-pool-process-operator';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure all pool operator relations are represented in process operator relations';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $poolOperatorRole = Role::where('name', 'pool_operator')->first();
        $processOperatorRole = Role::where('name', 'process_operator')->first();

        // collect all users that are pool operators
        $poolOperatorUsers = User::whereHas('roleAssignments', function ($query) use ($poolOperatorRole) {
            $query->where('role_id', $poolOperatorRole->id);
        })->with('roleAssignments')->get();

        foreach ($poolOperatorUsers as $poolUser) {
            // collect array of teams the user is a pool operator on
            $poolOperatorRoleAssignments = $poolUser->roleAssignments->where('role_id', $poolOperatorRole->id);
            $poolOperatorTeams = ($poolOperatorRoleAssignments->pluck('team_id')->unique()->toArray());

            // collect the pools per team then build an id array to sync
            $uniquePoolIdsToSync = Pool::whereIn('team_id', $poolOperatorTeams)->get()->pluck('id')->unique()->toArray();

            // go through each pool and add a process operator
            foreach ($uniquePoolIdsToSync as $poolId) {

                /** @var Pool $pool */
                $pool = Pool::findOrFail($poolId);
                $pool->addProcessOperators($poolUser->id);
            }
        }

        return Command::SUCCESS;
    }
}
