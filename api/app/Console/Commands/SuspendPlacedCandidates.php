<?php

namespace App\Console\Commands;

use App\Enums\PoolCandidateStatus;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

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
        $dateNow = Carbon::now();
        $applicableStatuses = [PoolCandidateStatus::PLACED_TERM->name, PoolCandidateStatus::PLACED_INDETERMINATE->name];

        DB::beginTransaction();
        try {
            DB::table('pool_candidates')
                ->whereIn('pool_candidate_status', $applicableStatuses)
                ->whereNull('suspended_at')
                ->update(['suspended_at' => $dateNow]);
            DB::commit();
        } catch (\Throwable $error) {
            DB::rollBack();
            throw $error;
        }

        return Command::SUCCESS;
    }
}
