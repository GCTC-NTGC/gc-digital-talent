<?php

namespace App\GraphQL\Mutations;

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
            throw ValidationException::withMessages(['AssessmentStepsSamePool']);
        }

        // Don't swap the reserved first two spots
        if ($stepA->sort_order < 3 || $stepB->sort_order < 3) {
            throw ValidationException::withMessages(['AssessmentStepCannotSwap']);
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
