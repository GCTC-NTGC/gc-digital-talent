<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\AssessmentStepType;
use App\Enums\PoolCandidateStatus;
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

        // NOTE: Should be temporary to keep legacy status in sync
        $status = match ($args['screening_stage']) {
            ScreeningStage::NEW_APPLICATION->name => PoolCandidateStatus::NEW_APPLICATION->name,
            ScreeningStage::APPLICATION_REVIEW->name => PoolCandidateStatus::APPLICATION_REVIEW->name,
            ScreeningStage::SCREENED_IN->name => PoolCandidateStatus::SCREENED_IN->name,
            ScreeningStage::UNDER_ASSESSMENT->name => PoolCandidateStatus::UNDER_ASSESSMENT->name,
            default => null,
        };

        if ($status) {
            $values['pool_candidate_status'] = $status;
        }

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
