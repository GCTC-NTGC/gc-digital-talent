<?php

namespace App\GraphQL\Mutations;
use App\Models\PoolCandidate;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use App\GraphQL\Validators\Mutation\DeleteApplicationValidator;

final class DeleteApplication
{
    /**
     * Delete an application
     * @param  null  $_
     * @param  array{}  $args
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

        // clear connected tables
        $application->cmoAssets()->sync([]);
        $application->expectedClassifications()->sync([]);
        $application->save();

        // execute hard delete and verify model was deleted by checking again by id returns null
        $application->forceDelete();
        $application = PoolCandidate::find($args['id']);
        if ($application !== null) {
            throw ValidationException::withMessages(['failed to delete']);
        }

        // true returning indicates successful deletion for graphQL response
        return true;
    }
}
