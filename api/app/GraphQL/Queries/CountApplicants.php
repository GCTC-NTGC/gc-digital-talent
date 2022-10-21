<?php

namespace App\GraphQL\Queries;
use App\Models\User;
use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;

final class CountApplicants
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $filters = $args["where"];

        // grab pools
        // $byPoolsCollection builds an array of id + candidates in a pool, $candidateTotal sums up candidates across pools
        $poolsArray = Pool::all()->pluck('id')->toArray();
        $byPoolsCollection = [];
        $candidateTotal = 0;
        foreach ($poolsArray as $key => $value) {
            // available scope
            $usersQueryBuilder = User::whereHas('poolCandidates', function (Builder $query) {
                $query->whereIn('job_looking_status', [ApiEnums::USER_STATUS_ACTIVELY_LOOKING, ApiEnums::USER_STATUS_OPEN_TO_OPPORTUNITIES]);
                }
            );

            // has diploma
            if (array_key_exists('hasDiploma', $filters)) {
                $usersQueryBuilder->where('has_diploma', $filters['hasDiploma']);
            }

            // count the people in the current pool
            $poolId = $value;
            $poolTotal = $usersQueryBuilder->whereHas('poolCandidates', function ($usersQueryBuilder) use ($value) {
                $usersQueryBuilder->where('pool_candidates.pool_id', $value);
            })->count();

            // push to iterated variables
            $candidateTotal = $candidateTotal + $poolTotal;
            array_push($byPoolsCollection, [
                "poolId" => $poolId,
                "poolTotal" => $poolTotal,
            ]);
        }

        return [
            "total" => $candidateTotal,
            "byPool" => $byPoolsCollection,
        ];
    }
}
