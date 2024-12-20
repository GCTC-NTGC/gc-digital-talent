<?php

namespace App\Console\Commands;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

class SuspendPlacedCandidates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:suspend-placed-candidates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set suspended at date to now() for placed term and indeterminate candidates';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $applicableStatuses = [PoolCandidateStatus::PLACED_TERM->name, PoolCandidateStatus::PLACED_INDETERMINATE->name];

        PoolCandidate::whereIn('pool_candidate_status', $applicableStatuses)
            ->whereNull('suspended_at')
            ->with('user')
            ->chunkById(100, function (Collection $candidates) {
                foreach ($candidates as $candidate) {
                    /** @var \App\Models\PoolCandidate $candidate */
                    $candidate->suspended_at = Carbon::now();
                    $candidate->save();
                }
            }
            );

        return Command::SUCCESS;
    }
}
