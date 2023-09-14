<?php

namespace App\Console\Commands;

use App\Models\PoolCandidate;
use App\Providers\PoolCandidateStatus;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SubmittedAtApplicationDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update-submitted-at';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'For pool candidates that should have submitted dates, submit them';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $dateNow = Carbon::now();

        PoolCandidate::whereNotIn('pool_candidate_status', [PoolCandidateStatus::DRAFT->name, PoolCandidateStatus::DRAFT_EXPIRED->name])
            ->where('submitted_at', null)
            ->update(['submitted_at' => $dateNow]);

        return Command::SUCCESS;
    }
}
