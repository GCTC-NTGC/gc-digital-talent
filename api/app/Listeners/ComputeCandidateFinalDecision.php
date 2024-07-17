<?php

namespace App\Listeners;

use App\Events\CandidateStatusChanged;

class ComputeCandidateFinalDecision
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
    public function handle(CandidateStatusChanged $event): void
    {
        $candidate = $event->result;

        $finalDecision = $candidate->computeFinalDecision();

        $candidate->computed_final_decision_weight = $finalDecision['weight'];
        $candidate->computed_final_decision = $finalDecision['decision'];

        $candidate->saveQuietly();
    }
}
