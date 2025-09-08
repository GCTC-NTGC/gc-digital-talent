<?php

namespace App\GraphQL\Mutations;

use App\Enums\AssessmentStepType;
use App\Models\AssessmentStep;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class SwapAssessmentStepOrder
{
    public function __invoke($_, array $args)
    {
        $stepA = AssessmentStep::find($args['stepIdA']);
        $stepB = AssessmentStep::find($args['stepIdB']);

        // Ensure the steps belong to the same pool
        if ($stepA->pool_id !== $stepB->pool_id) {
            throw ValidationException::withMessages(['stepIdA' => 'AssessmentStepsSamePool']);
        }

        // Don't swap reserved screening application or screening questions
        if (
            $stepA->type === AssessmentStepType::APPLICATION_SCREENING->name ||
            $stepB->type === AssessmentStepType::APPLICATION_SCREENING->name ||
            $stepA->type === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name ||
            $stepB->type === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name
        ) {
            throw ValidationException::withMessages(['stepIdA' => 'AssessmentStepCannotSwap']);
        }

        DB::beginTransaction();
        try {
            $temp = $stepA->sort_order;
            $stepA->sort_order = $stepB->sort_order;
            $stepB->sort_order = $temp;
            $stepA->save();
            $stepB->save();
            DB::commit();
        } catch (\Throwable $error) {
            DB::rollBack();
            throw $error;
        }

        return [$stepA, $stepB];
    }
}
