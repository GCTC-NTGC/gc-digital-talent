<?php

namespace App\GraphQL\Mutations;
use App\Models\PoolCandidate;
use Database\Helpers\ApiEnums;

final class CreateApplication
{
    /**
     * Create an application
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // attempt to find existing application, if found return that otherwise create new application
        $application = PoolCandidate::firstOrCreate([
            'user_id' => $args['userId'],
            'pool_id' => $args['poolId'],
          ]);
        // set to draft if new
        if ($application->pool_candidate_status == null) {
            $application->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_DRAFT;
            $application->save();
        }
        return $application;
    }
}
