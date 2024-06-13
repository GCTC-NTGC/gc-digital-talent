<?php

namespace App\Listeners;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentFinalDecision;
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
        $containsDisqualified = false;
        $finalDecision = AssessmentFinalDecision::TO_ASSESS->name;
        foreach ($decisionsPerStep as $stepId => $decision) {
            $decisions[] = [
                'step' => $stepId,
                'decision' => $decision,
            ];
            if ($decision === AssessmentDecision::UNSUCCESSFUL->name) {
                $containsDisqualified = true;
            }
        }

        // Null step indicates the candidate passed all steps
        if (is_null($currentStep)) {
            $finalDecision = AssessmentFinalDecision::QUALIFIED->name;
        }

        $candidate->computed_assessment_status = [
            'currentStep' => $currentStep,
            'stepDecisions' => $decisions,
            'finalDecision' => $containsDisqualified ? AssessmentFinalDecision::DISQUALIFIED->name : $finalDecision,
        ];

        $candidate->save();

    }
}
