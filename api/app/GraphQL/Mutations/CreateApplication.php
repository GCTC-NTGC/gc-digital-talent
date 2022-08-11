<?php

namespace App\GraphQL\Mutations;
use App\Models\PoolCandidate;

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
        $application = PoolCandidate::where('user_id', $args['userId'])->where('pool_id', $args['poolId'])->first();
        if($application) {
            return $application;
        }
        $newApplication = new PoolCandidate;
        $newApplication->user_id = $args['userId'];
        $newApplication->pool_id = $args['poolId'];
        $newApplication->save();
        return $newApplication;
    }
}
