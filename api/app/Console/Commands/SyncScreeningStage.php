<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncScreeningStage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-screening-stage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs candidates screening stage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('pool_candidates')->update([
            'screening_stage' => DB::raw(<<<'SQL'
                CASE
                    WHEN pool_candidate_status = 'NEW_APPLICATION' THEN 'NEW_APPLICATION'
                    WHEN pool_candidate_status = 'APPLICATION_REVIEW' THEN 'APPLICATION_REVIEW'
                    WHEN pool_candidate_status = 'SCREENED_IN' THEN 'SCREENED_IN'
                    WHEN pool_candidate_status = 'UNDER_ASSESSMENT' THEN 'UNDER_ASSESSMENT'
                    WHEN pool_candidate_status NOT IN ('NEW_APPLICATION', 'APPLICATION_REVIEW', 'SCREENED_IN', 'DRAFT', 'DRAFT_EXPIRED', 'UNDER_ASSESSMENT')
                        AND (computed_final_decision IS NULL OR computed_final_decision = 'TO_ASSESS')
                        AND removed_at IS NULL THEN 'UNDER_ASSESSMENT'
                    ELSE NULL
                END
            SQL),
        ]);
    }
}
