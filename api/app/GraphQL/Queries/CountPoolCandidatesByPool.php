<?php

namespace App\GraphQL\Queries;

use App\Models\PoolCandidate;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use App\Models\Pool;

final class CountPoolCandidatesByPool
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $filters = $args["where"];

        // query counts pool candidate rows, so start on that model
        $queryBuilder = PoolCandidate::query();

        // pool candidate filters go here

        // candidate pool scope
        if (array_key_exists('pools', $filters)) {
            // pool candidate filter uses Pool while Applicant filter users IdInput
            $pools = array_map(function ($id) {
                return ['id' => $id];
            }, $filters['pools']);
            PoolCandidate::filterByPools($queryBuilder, $pools);
        }

        $queryBuilder->whereHas('user', function (Builder $userQuery) use ($filters) {
            // user filters go here

            // user status scope
            User::scopeAvailableForOpportunities($userQuery);

            // has diploma
            if (array_key_exists('hasDiploma', $filters)) {
                User::scopeHasDiploma($userQuery, $filters['hasDiploma']);
            }

            // equity
            if (array_key_exists('equity', $filters)) {
                User::filterByEquity($userQuery, $filters['equity']);
            }

            // languageAbility
            if (array_key_exists('languageAbility', $filters)) {
                User::filterByLanguageAbility($userQuery, $filters['languageAbility']);
            }

            // operationalRequirements
            if (array_key_exists('operationalRequirements', $filters)) {
                User::filterByOperationalRequirements($userQuery, $filters['operationalRequirements']);
            }

            // locationPreferences
            if (array_key_exists('locationPreferences', $filters)) {
                User::filterByLocationPreferences($userQuery, $filters['locationPreferences']);
            }

            // wouldAcceptTemporary
            if (array_key_exists('wouldAcceptTemporary', $filters)) {
                User::scopeWouldAcceptTemporary($userQuery, $filters['wouldAcceptTemporary']);
            }

            // expectedClassifications
            if (array_key_exists('expectedClassifications', $filters)) {
                User::scopeClassifications($userQuery, $filters['expectedClassifications']);
            }

            // skills
            if (array_key_exists('skills', $filters)) {
                User::filterBySkills($userQuery, $filters['skills']);
            }
        });

        $databaseRows = $queryBuilder
            ->selectRaw('count(*) as candidate_count, pool_id')
            ->groupBy('pool_id')
            ->get();

        // would be nice to do this in the same query as above but alas...
        $allPools = Pool::whereIn('id', $databaseRows->pluck('pool_id'))->get();

        $resultSet = [];
        foreach ($databaseRows as $row) {
            array_push($resultSet, [
                "pool" => $allPools->sole(function ($pool) use ($row) { // attach the matching full Pool model to the results
                    return $pool->id == $row->pool_id;
                }),
                "candidateCount" => $row->candidate_count,
            ]);
        }

        return $resultSet;
    }
}
