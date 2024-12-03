<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\DeleteApplicationValidator;
use App\Models\PoolCandidate;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class DeleteApplication
{
    /**
     * Delete an application
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application, validate to ensure the status of the application is DRAFT or DRAFT_EXPIRED
        $application = PoolCandidate::find($args['id']);
        $deletionValidator = new DeleteApplicationValidator;
        $validator = Validator::make($application->toArray(), $deletionValidator->rules(), $deletionValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        // execute hard delete and verify model was deleted by checking that is not true
        $success = $application->forceDelete();
        if (! $success) {
            throw ValidationException::withMessages(['id' => ApiErrorEnums::APPLICATION_DELETE_FAILED]);
        }

        return $application;
    }
}
