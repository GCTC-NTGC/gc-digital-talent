<?php

namespace App\Console\Commands;

use App\Enums\CandidateRemovalReason;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Illuminate\Console\Command;

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
            PoolCandidateStatus::PLACED_CASUAL->name,
            PoolCandidateStatus::PLACED_TERM->name,
            PoolCandidateStatus::PLACED_INDETERMINATE->name,
            PoolCandidateStatus::EXPIRED->name,
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
        ];

        $applicableModels = PoolCandidate::with('user')
            ->whereNotIn('pool_candidate_status', [
                PoolCandidateStatus::DRAFT->name,
                PoolCandidateStatus::DRAFT_EXPIRED->name,
                PoolCandidateStatus::NEW_APPLICATION->name,
                PoolCandidateStatus::APPLICATION_REVIEW->name,
                PoolCandidateStatus::SCREENED_IN->name,
                PoolCandidateStatus::UNDER_ASSESSMENT->name,
            ])
            ->get();
        $modelCount = count($applicableModels);
        $modelUpdatedCount = 0;

        foreach ($applicableModels as $model) {
            $modelMutated = false;

            // set final_decision_at
            if (in_array($model->pool_candidate_status, $finalDecisionStatuses) && is_null($model->final_decision_at)) {
                $model->final_decision_at = $dateNow;

                $modelMutated = true;
            }

            // set removed_at
            if (in_array($model->pool_candidate_status, $removedStatuses) && is_null($model->removed_at)) {
                $model->removed_at = $dateNow;

                $modelMutated = true;
            }

            // set removal_reason
            if (in_array($model->pool_candidate_status, $removedStatuses) && is_null($model->removal_reason)) {
                if ($model->pool_candidate_status === PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name) {
                    $model->removal_reason = CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name;
                }
                if ($model->pool_candidate_status === PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name) {
                    $model->removal_reason = CandidateRemovalReason::NOT_RESPONSIVE->name;
                }
                if ($model->pool_candidate_status === PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name) {
                    $model->removal_reason = CandidateRemovalReason::OTHER->name;
                }
                if ($model->pool_candidate_status === PoolCandidateStatus::QUALIFIED_WITHDREW->name) {
                    $model->removal_reason = CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name;
                }
                if ($model->pool_candidate_status === PoolCandidateStatus::REMOVED->name) {
                    $model->removal_reason = CandidateRemovalReason::OTHER->name;
                }

                $modelMutated = true;
            }

            // set removal_reason_other
            if (
                in_array($model->pool_candidate_status, [PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name, PoolCandidateStatus::REMOVED->name]) &&
                is_null($model->removal_reason_other)
            ) {
                if ($model->pool_candidate_status === PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name) {
                    $model->removal_reason_other = 'Was "QUALIFIED_UNAVAILABLE"';
                }
                if ($model->pool_candidate_status === PoolCandidateStatus::REMOVED->name) {
                    $model->removal_reason_other = 'Was "REMOVED"';
                }

                $modelMutated = true;
            }

            // set placed_at
            if (in_array($model->pool_candidate_status, $placedStatuses) && is_null($model->placed_at)) {
                $model->placed_at = $dateNow;

                $modelMutated = true;
            }

            if ($modelMutated) {
                $modelUpdatedCount++;
                $model->save();
            }
        }

        $this->info("$modelCount records looped through");
        $this->info("$modelUpdatedCount records mutated");

        return Command::SUCCESS;
    }
}
