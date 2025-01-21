<?php

namespace App\Console\Commands;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

class UnsuspendPlacedCandidates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:unsuspend-placed-candidates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set suspended at date to null for placed term and indeterminate candidates';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $applicableStatuses = [PoolCandidateStatus::PLACED_TERM->name, PoolCandidateStatus::PLACED_INDETERMINATE->name];
        $candidatesUpdated = 0;

        PoolCandidate::whereIn('pool_candidate_status', $applicableStatuses)
            ->whereNotNull('suspended_at')
            ->with('user')
            ->chunkById(100, function (Collection $candidates) use (&$candidatesUpdated) {
                foreach ($candidates as $candidate) {
                    /** @var \App\Models\PoolCandidate $candidate */
                    $candidate->suspended_at = null;
                    $candidate->save();
                    $candidatesUpdated++;
                }
            }
            );

        $this->info("Updated $candidatesUpdated candidates");

        return Command::SUCCESS;
    }
}
