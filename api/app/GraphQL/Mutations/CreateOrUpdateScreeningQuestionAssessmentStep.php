<?php

namespace App\GraphQL\Mutations;

use App\Enums\AssessmentStepType;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolSkill;
use App\Models\ScreeningQuestion;
use Exception;
use Illuminate\Support\Facades\DB;

final class CreateOrUpdateScreeningQuestionAssessmentStep
{
    public function __invoke($_, array $args)
    {
        // Run everything in a transaction
        DB::beginTransaction();
        try {
            /** @var Pool $pool */
            $pool = Pool::find($args['poolId']);
            $existingQuestions = ScreeningQuestion::where('pool_id', '=', $args['poolId'])->get();
            $incomingQuestions = is_array($args['screeningQuestions']) ? $args['screeningQuestions'] : [];
            $incomingAssessmentStep = $args['assessmentStep'];
            $incomingQuestionIds = [];

            // Upsert assessment step
            $assessmentStep = AssessmentStep::updateOrCreate(
                ['pool_id' => $pool->id, 'type' => AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name],
                [...(isset($incomingAssessmentStep['title']) ? ['title' => $incomingAssessmentStep['title']] : [])]
            );
            if (isset($incomingAssessmentStep['poolSkills']['sync'])) {
                foreach ($incomingAssessmentStep['poolSkills']['sync'] as $skillID) {
                    $skill = PoolSkill::find($skillID);
                    if ($skill === null || $skill->pool_id !== $pool->id) {
                        throw new Exception('PoolSkillNotValid');
                    }
                }
                $assessmentStep->poolSkills()->sync($incomingAssessmentStep['poolSkills']['sync']);
            }

            // Create/update incoming questions based on the existence of an id
            foreach ($incomingQuestions as $incomingQuestion) {
                if (isset($incomingQuestion['id'])) {
                    array_push($incomingQuestionIds, $incomingQuestion['id']);
                    $questionToUpdate = $existingQuestions->find($incomingQuestion['id']);
                    if ($questionToUpdate === null) {
                        throw new Exception('ScreeningQuestionNotExist');
                    }

                    $questionToUpdate->question = $incomingQuestion['question'];
                    if (isset($incomingQuestion['sortOrder'])) {
                        $questionToUpdate->sort_order = $incomingQuestion['sortOrder'];
                    }

                    $questionToUpdate->save();
                } else {
                    $newQuestion = new ScreeningQuestion;
                    $newQuestion->assessment_step_id = $assessmentStep->id;
                    $newQuestion->question = $incomingQuestion['question'];
                    $newQuestion->sort_order = isset($incomingQuestion['sortOrder']) ? $incomingQuestion['sortOrder'] : null;
                    $pool->screeningQuestions()->save($newQuestion);
                }
            }

            // Remove old questions which aren't included in the sync request
            foreach ($existingQuestions as $existing) {
                if (! in_array($existing->id, $incomingQuestionIds)) {
                    $existing->delete();
                }
            }

            DB::commit();
        } catch (\Throwable $error) {
            // Rollback changes and return error
            DB::rollBack();
            throw $error;
        }

        return $pool;
    }
}
