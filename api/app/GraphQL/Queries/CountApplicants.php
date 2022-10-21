<?php

namespace App\GraphQL\Queries;
use App\Models\User;
use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

final class CountApplicants
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // split $args into array of filters
        $filters = $args["where"];

        // available scope
        $usersGet = User::with('poolCandidates')->whereIn('job_looking_status', [ApiEnums::USER_STATUS_ACTIVELY_LOOKING, ApiEnums::USER_STATUS_OPEN_TO_OPPORTUNITIES])->get();
        // $usersQueryBuilder = User::whereHas('poolCandidates', function (Builder $query) {
        //         $query->whereIn('job_looking_status', [ApiEnums::USER_STATUS_ACTIVELY_LOOKING, ApiEnums::USER_STATUS_OPEN_TO_OPPORTUNITIES]);
        //     }
        // );

        // hasDiploma filter conditional
        if (array_key_exists('hasDiploma', $filters)) {
            $usersGet = $usersGet->where('has_diploma', $filters['hasDiploma']);
        }

        // by pools section
        $poolsArray = Pool::all()->pluck('id')->toArray();
        $byPoolsCollection = [];
        foreach ($poolsArray as $key => $value) {
            $poolId = $value;
            $poolTotal = $usersGet->where('pool_candidates.pool_id', $value)->count();

            // /$userQueryClone = $usersQueryBuilder;
            // $poolTotal = $usersQueryBuilder->whereHas('pool_candidates', function ($usersQueryBuilder, $value) {
            //     $usersQueryBuilder->where('pool_candidates.pool_id', $value);
            // });
            // $poolTotal = $userQueryClone->where('id', $value);
            array_push($byPoolsCollection, [
                "poolId" => $poolId,
                "poolTotal" => $poolTotal,
            ]);
        }

        return [
            "total" => $usersGet->count(),
            "byPool" => $byPoolsCollection,
        ];
    }
}
