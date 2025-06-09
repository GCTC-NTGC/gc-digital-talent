<?php

namespace App\Listeners;

use App\Enums\PoolCandidateStatus;
use App\Events\AssessmentResultSaved;
use App\Events\CandidateStatusChanged;

class ComputeCandidateAssessmentStatus
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AssessmentResultSaved $event): void
    {
        $result = $event->result;
        $result->load([
            'poolCandidate',
            'poolCandidate.pool.assessmentSteps',
        ]);

        /** @var \App\Models\PoolCandidate */
        $candidate = $result->poolCandidate;

        $assessmentStatus = $candidate->computeAssessmentStatus();

        $candidate->computed_assessment_status = $assessmentStatus;

        if ($candidate->pool_candidate_status === PoolCandidateStatus::NEW_APPLICATION->name) {
            $candidate->pool_candidate_status = PoolCandidateStatus::UNDER_ASSESSMENT->name;
        }

        $candidate->save();

        CandidateStatusChanged::dispatch($candidate);

    }
}
