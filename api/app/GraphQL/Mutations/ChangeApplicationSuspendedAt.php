<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use App\GraphQL\Validators\Mutation\ChangeApplicationSuspendedAtValidator;

final class ChangeApplicationSuspendedAt
{
    /**
     * Suspends/un-suspends the application.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application, validate to ensure the has been submitted
        $application = PoolCandidate::find($args['id']);
        $suspensionValidator = new ChangeApplicationSuspendedAtValidator;
        $validator = Validator::make($application->toArray(), $suspensionValidator->rules(), $suspensionValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        $setSuspended = $args['setSuspended'];
        $dateNow = Carbon::now();
        $newSuspendedAt = $setSuspended ? $dateNow : null;
        $application->update(['suspended_at' => $newSuspendedAt]);
        return $application;
    }
}
