<?php

namespace App\GraphQL\Queries;

use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

// Another failed paginate directive builder attempt.
final class PoolCandidatesByApplicant
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $filters = $args["where"];

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

            // hasDiploma
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
                User::filterBySkills($userQuery, $filters['skills']);
            }
        });

        return $queryBuilder;
    }
}
