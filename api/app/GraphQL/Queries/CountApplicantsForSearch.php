<?php

namespace App\GraphQL\Queries;

use App\Models\User;

final class CountApplicantsForSearch
{
    /**
     * @param  array<string, mixed>  $args
     *
     * @disregard P1003 We are not using this var
     */
    public function __invoke($_, array $args)
    {
        $filters = ! empty($args['where']) ? $args['where'] : [];

        // on the user model
        $userQuery = User::query();

        // filter for applicants with relevant candidacies
        // args splitting is done in scope
        $userQuery->whereHasTalentSearchablePublishingGroups($args);

        // hasDiploma
        if (array_key_exists('hasDiploma', $filters)) {
            $userQuery->whereHasDiploma($filters['hasDiploma']);
        }

        // equity
        if (array_key_exists('equity', $filters)) {
            $userQuery->whereEquityIn($filters['equity']);
        }

        // languageAbility
        if (array_key_exists('languageAbility', $filters)) {
            $userQuery->whereLanguageAbility($filters['languageAbility']);
        }

        // operationalRequirements
        if (array_key_exists('operationalRequirements', $filters)) {
            $userQuery->whereOperationalRequirementsIn($filters['operationalRequirements']);
        }

        // for search page, use the special scope that interacts with two fields
        if (array_key_exists('locationPreferences', $filters) || array_key_exists('flexibleWorkLocations', $filters)) {
            $workRegions = array_key_exists('locationPreferences', $filters) ? $filters['locationPreferences'] : null;
            $flexibleWorkLocations = array_key_exists('flexibleWorkLocations', $filters) ? $filters['flexibleWorkLocations'] : null;

            $userQuery->whereFlexibleLocationAndRegionSpecialMatching($workRegions, $flexibleWorkLocations);
        }

        // positionDuration
        if (array_key_exists('positionDuration', $filters)) {
            $userQuery->wherePositionDurationIn($filters['positionDuration']);
        }

        // skills
        if (array_key_exists('skills', $filters)) {
            $userQuery->whereSkillsAdditive($filters['skills']);
        }

        $userCount = $userQuery->count();

        return $userCount;
    }
}
