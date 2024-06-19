<?php

namespace App\Listeners;

use App\Events\AssessmentResultSaved;

class ComputeFinalDecisionAndCurrentStep
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

        $candidate = $result->poolCandidate;

        $assessmentStatus = $candidate->computeAssessmentStatus();

        $candidate->computed_assessment_status = $assessmentStatus;

        $candidate->save();

    }
}
