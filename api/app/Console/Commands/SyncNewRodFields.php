<?php

namespace App\Console\Commands;

use App\Enums\CandidateRemovalReason;
use App\Enums\PoolCandidateStatus;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncNewRodFields extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-rod-fields';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Where the new RoD fields should be non-null, insert an appropriate value';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $dateNow = Carbon::now();
        $placedStatuses = PoolCandidateStatus::placedGroup();
        $removedStatuses = PoolCandidateStatus::removedGroup();
        $finalDecisionStatuses = [
            PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
            PoolCandidateStatus::QUALIFIED_WITHDREW->name,
            PoolCandidateStatus::PLACED_TENTATIVE->name,
            PoolCandidateStatus::PLACED_CASUAL->name,
            PoolCandidateStatus::PLACED_TERM->name,
            PoolCandidateStatus::PLACED_INDETERMINATE->name,
            PoolCandidateStatus::EXPIRED->name,
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
        ];

        // set final_decision_at
        DB::table('pool_candidates')
            ->whereIn('pool_candidate_status', $finalDecisionStatuses)
            ->whereNull('final_decision_at')
            ->update(['final_decision_at' => $dateNow]);

        // set removed_at
        DB::table('pool_candidates')
            ->whereIn('pool_candidate_status', $removedStatuses)
            ->whereNull('removed_at')
            ->update(['removed_at' => $dateNow]);

        // set removal_reason and removal_reason_other
        DB::table('pool_candidates')
            ->where('pool_candidate_status', PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name)
            ->whereNull('removal_reason')
            ->update([
                'removal_reason' => CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name,
            ]);
        DB::table('pool_candidates')
            ->where('pool_candidate_status', PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name)
            ->whereNull('removal_reason')
            ->update([
                'removal_reason' => CandidateRemovalReason::NOT_RESPONSIVE->name,
            ]);
        DB::table('pool_candidates')
            ->where('pool_candidate_status', PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name)
            ->whereNull('removal_reason')
            ->update([
                'removal_reason' => CandidateRemovalReason::OTHER->name,
                'removal_reason_other' => 'Was "QUALIFIED_UNAVAILABLE"',
            ]);
        DB::table('pool_candidates')
            ->where('pool_candidate_status', PoolCandidateStatus::QUALIFIED_WITHDREW->name)
            ->whereNull('removal_reason')
            ->update([
                'removal_reason' => CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name,
            ]);
        DB::table('pool_candidates')
            ->where('pool_candidate_status', PoolCandidateStatus::REMOVED->name)
            ->whereNull('removal_reason')
            ->update([
                'removal_reason' => CandidateRemovalReason::OTHER->name,
                'removal_reason_other' => 'Was "REMOVED"',
            ]);

        // set placed_at
        DB::table('pool_candidates')
            ->whereIn('pool_candidate_status', $placedStatuses)
            ->whereNull('placed_at')
            ->update(['placed_at' => $dateNow]);

        return Command::SUCCESS;
    }
}
