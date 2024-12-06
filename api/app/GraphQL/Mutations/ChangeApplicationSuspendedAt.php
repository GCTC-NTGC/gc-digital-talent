<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\ChangeApplicationSuspendedAtValidator;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class ChangeApplicationSuspendedAt
{
    /**
     * Suspends/un-suspends the application.
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application, validate to ensure it has been submitted
        $application = PoolCandidate::find($args['id']);
        $suspensionValidator = new ChangeApplicationSuspendedAtValidator;
        $validator = Validator::make($application->toArray(), $suspensionValidator->rules(), $suspensionValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        $isSuspended = $args['isSuspended'];
        $dateNow = Carbon::now();

        // Don't replace the suspension date if already set
        if ($isSuspended && ! is_null($application->suspended_at)) {
            return $application;
        }

        $newSuspendedAt = $isSuspended ? $dateNow : null;
        $application->update(['suspended_at' => $newSuspendedAt]);

        return $application;
    }
}
