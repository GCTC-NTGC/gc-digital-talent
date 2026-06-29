<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\AssessmentStepType;
use App\Enums\ScreeningStage;
use App\Models\PoolCandidate;

final readonly class UpdatePoolCandidateScreeningStage
{
    public function __invoke(null $_, array $args)
    {
        $candidate = PoolCandidate::with(['pool.assessmentSteps'])->findOrFail($args['id']);
        $values = [
            'screening_stage' => $args['screening_stage'],
        ];

        if (! empty($args['assessmentStep']['connect'])) {
            $values['assessment_step_id'] = $args['assessmentStep']['connect'];
        } elseif ($args['screening_stage'] === ScreeningStage::UNDER_ASSESSMENT->name) {
            $values['assessment_step_id'] = $candidate->pool->assessmentSteps->sortBy('sortOrder')
                ->firstWhere(function ($step) {
                    return $step->type !== AssessmentStepType::APPLICATION_SCREENING->name && $step->type !== AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name;
                })->id ?? null;
        }

        // If they want to disconnect, or it is not under assessment, we want the step to be null
        if (! empty($args['assessmentStep']['disconnect']) || $args['screening_stage'] !== ScreeningStage::UNDER_ASSESSMENT->name) {
            $values['assessment_step_id'] = null;
        }

        $candidate->update($values);
        $candidate->refresh();

        return $candidate;
    }
}
