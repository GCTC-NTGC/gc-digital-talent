<?php

namespace App\Console\Commands;

use App\Models\Pool;
use App\Models\PoolCandidateFilter;
use App\Models\User;
use Illuminate\Console\Command;

class RemoveOperationalRequirement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-operational-requirement {operationalRequirement}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove operational requirement from list of options';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $value = $this->argument('operationalRequirement');
        $users = User::whereJsonContains('accepted_operational_requirements', $value)->get();
        foreach ($users as $user) {
            $collectionUser = collect($user->accepted_operational_requirements);
            $keyUser = $collectionUser->search($value);
            $user->accepted_operational_requirements = $collectionUser->forget($keyUser)->flatten()->toArray();
            $user->save();
        }

        /** @var array<Pool> $pools */
        $pools = Pool::whereJsonContains('operational_requirements', $value)->get();
        foreach ($pools as $pool) {
            $collectionPool = collect($pool->operational_requirements);
            $keyPool = $collectionPool->search($value);
            $pool->operational_requirements = $collectionPool->forget($keyPool)->flatten()->toArray();
            $pool->save();
        }
        $poolCandidateFilters = PoolCandidateFilter::whereJsonContains('operational_requirements', $value)->get();
        foreach ($poolCandidateFilters as $poolCandidateFilter) {
            $collectionPoolCandidateFilters = collect($poolCandidateFilter->operational_requirements);
            $keyPoolCandidateFilters = $collectionPoolCandidateFilters->search($value);
            $poolCandidateFilter->operational_requirements = $collectionPoolCandidateFilters->forget($keyPoolCandidateFilters)->flatten()->toArray();
            $poolCandidateFilter->save();
        }
    }
}
