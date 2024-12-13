<?php

namespace App\GraphQL\Queries;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

final class CountPoolCandidatesByPool
{
    /**
     * @param  array<string, mixed>  $args
     *
     * @disregard P1003 We are not using this var
     */
    public function __invoke($_, array $args)
    {
        $filters = ! empty($args['where']) ? $args['where'] : [];

        // query counts pool candidate rows, so start on that model
        $queryBuilder = PoolCandidate::query();

        $queryBuilder->whereHas('pool', function ($query) use ($filters) {
            $query->wherePublished();

            if (array_key_exists('qualifiedClassifications', $filters)) {
                $query->whereClassifications($filters['qualifiedClassifications']);
            }

            if (array_key_exists('workStreams', $filters)) {
                $query->whereWorkStreamsIn($filters['workStreams']);
            }
        });

        // available candidates scope (scope CANDIDATE_STATUS_QUALIFIED_AVAILABLE or CANDIDATE_STATUS_PLACED_CASUAL, or PLACED_TENTATIVE)
        PoolCandidate::scopeAvailable($queryBuilder);

        // Only display IT & OTHER publishing group candidates
        PoolCandidate::scopeInTalentSearchablePublishingGroup($queryBuilder);

        $queryBuilder->whereHas('user', function (Builder $userQuery) use ($filters) {
            // user filters go here

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

            // skills
            if (array_key_exists('skills', $filters)) {
                User::scopeSkillsAdditive($userQuery, $filters['skills']);
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
