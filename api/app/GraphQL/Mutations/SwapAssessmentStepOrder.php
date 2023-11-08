<?php

namespace App\GraphQL\Mutations;

use App\Models\AssessmentStep;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class SwapAssessmentStepOrder
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $stepA = AssessmentStep::find($args['stepA']);
        $stepB = AssessmentStep::find($args['stepB']);

        // Ensure the steps belong to the same pool
        if ($stepA->pool_id !== $stepB->pool_id) {
            throw ValidationException::withMessages(['AssessmentSteps must belong to the same pool.']);
        }

        // Don't swap the reserved first two spots
        if ($stepA->sort_order < 3 || $stepB->sort_order < 3) {
            throw ValidationException::withMessages(['One or both of the given steps cannot be swapped.']);
        }

        $temp = $stepA->sort_order;
        $stepA->sort_order = $stepB->sort_order;
        $stepB->sort_order = $temp;
        $stepA->save();
        $stepB->save();

        return [$stepA, $stepB];
    }
}
