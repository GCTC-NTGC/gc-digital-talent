<?php

namespace App\GraphQL\Mutations;
use App\Models\PoolCandidate;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use App\GraphQL\Validators\Mutation\ArchiveApplicationValidator;

final class ArchiveApplication
{
    /**
     * Archive an application
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application, validate to ensure the status of the application is EXPIRED (more statuses can be added later)
        $application = PoolCandidate::find($args['id'])->load(['pool_candidate_status']);;
        $archivalValidator = new ArchiveApplicationValidator;
        $validator = Validator::make($application->toArray(), $archivalValidator->rules(), $archivalValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }
        $application->update(['is_archived' => true]);
        return $application;
    }
}
