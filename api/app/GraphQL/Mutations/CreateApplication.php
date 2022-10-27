<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class CreateApplication
{
    /**
     * Create an application
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // Check to see if the pool is published (can't apply to draft or expired)
        $pool = Pool::find($args['poolId']);
        if (in_array($pool->status, [
            ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT,
            ApiEnums::POOL_ADVERTISEMENT_IS_EXPIRED
        ])) {
            throw ValidationException::withMessages(['you are unable to apply to this pool']);
        }

        // Do not allow users to apply if they already have
        $exists = PoolCandidate::where('user_id', $args['userId'])
            ->where('pool_id', $args['poolId'])
            ->exists();
        if ($exists) {
            throw ValidationException::withMessages(['you are unable to apply to this pool']);
        }

        // attempt to find existing application, if found return that otherwise create new application
        $application = PoolCandidate::firstOrCreate([
            'user_id' => $args['userId'],
            'pool_id' => $args['poolId'],
        ]);

        // draft expiry date is the same as the expiry of the pool it is attached to
        $poolExpiry = Pool::find($application->pool_id)->expiry_date;

        // set to DRAFT in the database itself, Accessor already returns this as DRAFT if unexpired via API
        $application->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_DRAFT;
        $application->expiry_date = $poolExpiry;
        $application->save();

        return $application;
    }
}
