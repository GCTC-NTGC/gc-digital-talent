<?php

namespace App\GraphQL\Queries;

use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Database\Helpers\ApiEnums;

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
            PoolCandidate::scopeAvailableInPools($queryBuilder, $pools);
        }

        // available candidates scope (scope CANDIDATE_STATUS_QUALIFIED_AVAILABLE or CANDIDATE_STATUS_PLACED_CASUAL)
        PoolCandidate::scopeAvailable($queryBuilder);

        // expiry status filter (filter active pool candidates)
        PoolCandidate::scopeExpiryFilter($queryBuilder, [ 'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE ]);


        $queryBuilder->whereHas('user', function (Builder $userQuery) use ($filters) {
            // user filters go here

            // user status scope
            User::scopeAvailableForOpportunities($userQuery);

            // hasDiploma
            if (array_key_exists('hasDiploma', $filters)) {
                User::scopeHasDiploma($userQuery, $filters['hasDiploma']);
            }

            // equity
            if (array_key_exists('equity', $filters)) {
                User::scopeEquity($userQuery, $filters['equity']);
            }

            // languageAbility
            if (array_key_exists('languageAbility', $filters)) {
                User::scopeLanguageAbility($userQuery, $filters['languageAbility']);
            }

            // operationalRequirements
            if (array_key_exists('operationalRequirements', $filters)) {
                User::scopeOperationalRequirements($userQuery, $filters['operationalRequirements']);
            }

            // locationPreferences
            if (array_key_exists('locationPreferences', $filters)) {
                User::scopeLocationPreferences($userQuery, $filters['locationPreferences']);
            }

            // positionDuration
            if (array_key_exists('positionDuration', $filters)) {
                User::scopePositionDuration($userQuery, $filters['positionDuration']);
            }

            // expectedClassifications
            if (array_key_exists('expectedClassifications', $filters)) {
                User::scopeClassifications($userQuery, $filters['expectedClassifications']);
            }

            // skills
            if (array_key_exists('skills', $filters)) {
                User::scopeSkills($userQuery, $filters['skills']);
            }
        });

        $databaseRows = $queryBuilder
            ->with('pool')
            ->selectRaw('count(*) as candidate_count, pool_id')
            ->groupBy('pool_id')
            ->get();

        return $databaseRows;
    }
}
