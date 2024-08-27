<?php

namespace App\Console\Commands;

use App\Models\Community;
use App\Models\Pool;
use Illuminate\Console\Command;

class ProcessAndCommunityTeamableCreation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:teamable-creation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure processes/pools and communities have teamable relation, creating one if not present';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $communities = Community::all();

        foreach ($communities as $community) {
            $community->team()->firstOrCreate([], [
                'name' => 'community-'.$community->id,
            ]);
        }

        $pools = Pool::all();

        foreach ($pools as $pool) {
            $pool->team()->firstOrCreate([], [
                'name' => 'pool-'.$pool->id,
            ]);
        }

        return Command::SUCCESS;
    }
}
