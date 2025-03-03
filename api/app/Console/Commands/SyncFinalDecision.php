<?php

namespace App\Console\Commands;

use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

class SyncFinalDecision extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-final-decision';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs candidates final decision';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        PoolCandidate::chunk(100, function (Collection $candidates) {
            foreach ($candidates as $candidate) {
                $finalDecision = $candidate->computeFinalDecision();

                $candidate->computed_final_decision_weight = $finalDecision['weight'];
                $candidate->computed_final_decision = $finalDecision['decision'];

                $candidate->save();
            }
        });
    }
}
