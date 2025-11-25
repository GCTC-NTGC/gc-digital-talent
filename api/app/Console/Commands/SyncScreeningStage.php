<?php

namespace App\Console\Commands;

use App\Enums\PoolCandidateStatus;
use App\Enums\ScreeningStage;
use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;

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
    protected $description = 'Syncs candidates screning stage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        PoolCandidate::chunk(100, function (Collection $candidates) {
            foreach ($candidates as $candidate) {
                $stage = match ($candidate->pool_candidate_status) {
                    PoolCandidateStatus::NEW_APPLICATION->name => ScreeningStage::NEW_APPLICATION->name,
                    PoolCandidateStatus::APPLICATION_REVIEW->name => ScreeningStage::APPLICATION_REVIEW->name,
                    PoolCandidateStatus::SCREENED_IN->name => ScreeningStage::SCREENED_IN->name,
                    default => null,
                };

                // If the status does not match, no final decision has been made and they are not removed,
                // assume they are being assessed
                if (! $stage && ! $candidate->computed_final_decision && ! $candidate->final_decision_at && ! $candidate->removed_at) {
                    $stage = ScreeningStage::UNDER_ASSESSMENT->name;
                }

                $candidate->screening_stage = $stage;

                $candidate->save();
            }
        });
    }
}
