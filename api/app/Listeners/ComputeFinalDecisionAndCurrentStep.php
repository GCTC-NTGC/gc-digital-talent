<?php

namespace App\Listeners;

use App\Enums\AssessmentDecision;
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

        $decisionsPerStep = $candidate->computeDecisionsPerAssessmentStep();

        $currentStep = 1;
        $orderedSteps = $candidate->pool->assessmentSteps()->orderBy('sort_order', 'ASC')->get();
        foreach ($orderedSteps as $step) {
            $decision = $decisionsPerStep[$step->id];

            if (! $decision || $decision === AssessmentDecision::UNSUCCESSFUL->name) {
                break; // To asses or unsuccessful so break
            }

            // Successful or on hold so increment step
            $currentStep += 1;

        }

        if ($currentStep > count($candidate->pool->assessmentSteps)) {
            $currentStep = null;
        }

        $decisions = [];
        foreach ($decisionsPerStep as $stepId => $decision) {
            $decisions[] = [
                'step' => $stepId,
                'decision' => $decision,
            ];
        }

        $candidate->computed_assessment_status = [
            'current_step' => $currentStep,
            'decisions' => $decisions,
        ];

        $candidate->save();

    }
}
