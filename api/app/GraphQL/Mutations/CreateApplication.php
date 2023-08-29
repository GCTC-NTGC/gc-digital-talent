<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\CreateApplicationValidator;
use App\Models\Pool;
use App\Models\PoolCandidate;
use Database\Helpers\ApiEnums;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class CreateApplication
{
    /**
     * Create an application
     *
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $createValidator = new CreateApplicationValidator($args['poolId'], $args['userId']);
            $validator = Validator::make(
                $args,
                $createValidator->rules(),
                $createValidator->messages(),
            );

            if ($validator->fails()) {
                throw new ValidationException(
                    $validator->errors()->first(),
                    $validator
                );
            }

            // Passed validation so we are free to create
            $application = PoolCandidate::create([
                'user_id' => $args['userId'],
                'pool_id' => $args['poolId'],
            ]);

            // set to DRAFT in the database itself, Accessor already returns this as DRAFT if unexpired via API
            $application->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_DRAFT;
            $application->save();
        } catch (\Throwable $error) {
            // Add the error to the pool
            $errorPool = app(\Nuwave\Lighthouse\Execution\ErrorPool::class);
            $errorPool->record($error);

            // Partial error, lets return the found pool
            $application = PoolCandidate::where('user_id', $args['userId'])
                ->where('pool_id', $args['poolId'])
                ->first();
        }

        return $application;
    }
}
