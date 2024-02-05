<?php

namespace App\Console\Commands;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Illuminate\Console\Command;

class RemoveExpiryDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:wipe-expiryDates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Null expiry dates for non-qualified pool candidates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        PoolCandidate::WhereIn('pool_candidate_status', [
            PoolCandidateStatus::DRAFT->name,
            PoolCandidateStatus::DRAFT_EXPIRED->name,
            PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::SCREENED_IN->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name,
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
            PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
            PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
        ])
            ->whereNotNull('expiry_date')
            ->update(['expiry_date' => null]);

        return Command::SUCCESS;
    }
}
