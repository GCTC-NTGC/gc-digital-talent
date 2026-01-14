<?php

namespace App\Builders;

use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\FlexibleWorkLocation;
use App\Enums\LanguageAbility;
use App\Enums\PoolCandidateStatus;
use App\Models\User;
use App\Utilities\PostgresTextSearch;
use App\Utilities\PostgresTextSearchMatchingType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * @template TModelClass of \Illuminate\Database\Eloquent\Model
 *
 * @extends \Illuminate\Database\Eloquent\Builder<TModelClass>
 */
class UserBuilder extends Builder
{
    /**
     * Get users that have completed their profile
     */
    public function whereProfileComplete(?bool $isProfileComplete): self
    {
        if ($isProfileComplete) {
            $this->whereNotNull('first_name');
            $this->whereNotNull('last_name');
            $this->whereNotNull('email');
            $this->whereNotNull('telephone');
            $this->whereNotNull('preferred_lang');
            $this->whereNotNull('preferred_language_for_interview');
            $this->whereNotNull('preferred_language_for_exam');
            $this->whereNotNull('current_province');
            $this->whereNotNull('current_city');
            $this->where(function ($query) {
                $query->whereNotNull('looking_for_english');
                $query->orWhereNotNull('looking_for_french');
                $query->orWhereNotNull('looking_for_bilingual');
            });
            $this->whereNotNull('computed_is_gov_employee');
            $this->where(function (Builder $query) {
                $query->where('has_priority_entitlement', false)
                    ->orWhere(function (Builder $query) {
                        $query->where('has_priority_entitlement', true)
                            ->whereNotNull('priority_number');
                    });
            });
            $this->whereNotNull('location_preferences');
            $this->whereJsonLength('location_preferences', '>', 0);
            $this->whereNotNull('flexible_work_locations');
            $this->whereJsonLength('flexible_work_locations', '>', 0);
            $this->whereJsonLength('position_duration', '>', 0);
            $this->whereNotNull('citizenship');
            $this->whereNotNull('armed_forces_status');
        }

        return $this;
    }

    /**
     * Filters users by the Pools they are in.
     *
     * @param  array  $poolFilters  Each pool filter must contain a poolId, and may contain expiryStatus, statuses, and suspendedStatus fields
     */
    public function wherePoolExists(?array $poolFilters): self
    {
        if (empty($poolFilters)) {
            return $this;
        }

        // Pool acts as an OR filter. The query should return valid candidates in ANY of the pools.
        return $this->whereExists(function ($query) use ($poolFilters) {
            $query->select('id')
                ->from('pool_candidates')
                ->whereColumn('pool_candidates.user_id', 'users.id')
                ->where(function ($query) use ($poolFilters) {
                    $makePoolFilterClause = function ($filter) {
                        return function ($query) use ($filter) {
                            $query->where('pool_candidates.pool_id', $filter['poolId']);
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == CandidateExpiryFilter::ACTIVE->name) {
                                    $query->whereDate('expiry_date', '>=', date('Y-m-d'))
                                        ->orWhereNull('expiry_date');
                                } elseif (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == CandidateExpiryFilter::EXPIRED->name) {
                                    $query->whereDate('expiry_date', '<', date('Y-m-d'));
                                }
                            });
                            if (array_key_exists('statuses', $filter) && ! empty($filter['statuses'])) {
                                $query->whereIn('pool_candidates.pool_candidate_status', $filter['statuses']);
                            }
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == CandidateSuspendedFilter::ACTIVE->name) {
                                    $query->where('suspended_at', '>=', Carbon::now())
                                        ->orWhereNull('suspended_at');
                                } elseif (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == CandidateSuspendedFilter::SUSPENDED->name) {
                                    $query->where('suspended_at', '<', Carbon::now());
                                }
                            });

                            return $query;
                        };
                    };
                    foreach ($poolFilters as $index => $filter) {
                        if ($index == 0) {
                            $query->where($makePoolFilterClause($filter));
                        } else {
                            $query->orWhere($makePoolFilterClause($filter));
                        }
                    }

                    return $query;
                });
        });
    }

    /**
     * Return applicants with PoolCandidates in any of the given pools.
     * Only consider pool candidates who are available,
     * ie not expired, with the AVAILABLE status, and the application is not suspended
     */
    public function whereAvailableInPools(?array $poolIds): self
    {
        if (empty($poolIds)) {
            return $this;
        }

        $poolFilters = [];
        foreach ($poolIds as $index => $poolId) {
            $poolFilters[$index] = [
                'poolId' => $poolId,
                'expiryStatus' => CandidateExpiryFilter::ACTIVE->name,
                'statuses' => PoolCandidateStatus::qualifiedEquivalentGroup(),
                'suspendedStatus' => CandidateSuspendedFilter::ACTIVE->name,
            ];
        }

        return $this->wherePoolExists($poolFilters);
    }

    public function whereLanguageAbility(?string $languageAbility): self
    {
        if (empty($languageAbility)) {
            return $this;
        }

        // $languageAbility comes from enum LanguageAbility
        // filtering on fields looking_for_<english/french/bilingual>
        if ($languageAbility == LanguageAbility::ENGLISH->name) {
            $this->where('looking_for_english', true);
        }
        if ($languageAbility == LanguageAbility::FRENCH->name) {
            $this->where('looking_for_french', true);
        }
        if ($languageAbility == LanguageAbility::BILINGUAL->name) {
            $this->where('looking_for_bilingual', true);
        }

        return $this;
    }

    public function whereDepartmentsIn(?array $departmentIds): self
    {
        if (empty($departmentIds)) {
            return $this;
        }

        return $this->whereHas('department', function ($query) use ($departmentIds) {
            return $query->whereIn('id', $departmentIds);
        });
    }

    public function whereOperationalRequirementsIn(?array $operationalRequirements): self
    {
        // if no filters provided then return query unchanged
        if (empty($operationalRequirements)) {
            return $this;
        }

        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
        return $this->whereJsonContains('accepted_operational_requirements', $operationalRequirements);
    }

    public function whereLocationPreferencesIn(?array $workRegions): self
    {
        if (empty($workRegions)) {
            return $this;
        }

        // LocationPreferences acts as an OR filter. The query should return candidates willing to work in ANY of the workRegions.
        return $this->where(function ($query) use ($workRegions) {
            foreach ($workRegions as $index => $workRegion) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->whereJsonContains('location_preferences', $workRegion);
                } else {
                    $query->orWhereJsonContains('location_preferences', $workRegion);
                }
            }
        });
    }

    /**
     * Flexible Work Locations filtering
     */
    public function whereFlexibleWorkLocationsIn(?array $flexibleWorkLocations): self
    {
        if (empty($flexibleWorkLocations)) {
            return $this;
        }

        return $this->where(function ($query) use ($flexibleWorkLocations) {
            foreach ($flexibleWorkLocations as $location) {
                $query->orWhereJsonContains('flexible_work_locations', $location);
            }
        });
    }

    /**
     * Skills filtering
     */
    public function whereSkillsIntersectional(?array $skill_ids): self
    {
        if (empty($skill_ids)) {
            return $this;
        }

        // skills AND filtering. The query should only return candidates with ALL of the skills.
        foreach ($skill_ids as $skill_id) {
            $this->whereExists(function ($query) use ($skill_id) {
                $query->select(DB::raw('null'))
                    ->from('user_skills')
                    ->whereColumn('user_skills.user_id', 'users.id')
                    ->where('user_skills.skill_id', $skill_id);
            });
        }

        return $this;
    }

    public function whereSkillsAdditive(?array $skill_ids): self
    {
        if (empty($skill_ids)) {
            return $this;
        }

        // skills OR filtering. The query should return candidates with ANY of the skills.
        return $this->whereExists(function ($query) use ($skill_ids) {
            $query->select(DB::raw('null'))
                ->from('user_skills')
                ->whereColumn('user_skills.user_id', 'users.id')
                ->whereIn('user_skills.skill_id', $skill_ids);
        });

    }

    /**
     * Scopes the query to only return users in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public function whereAppliedClassificationsIn(?array $classifications): self
    {
        if (empty($classifications)) {
            return $this;
        }

        return $this->whereHas('poolCandidates', function ($query) use ($classifications) {
            $query->whereAppliedClassificationsIn($classifications);
        });
    }

    /**
     * Scopes the query to only return users who are available in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public function whereQualifiedInClassificationsIn(?array $classifications): self
    {
        if (empty($classifications)) {
            return $this;
        }

        return $this->whereHas('poolCandidates', function ($query) use ($classifications) {
            $query->whereQualifiedInClassificationsIn($classifications);
        });
    }

    /**
     * Scopes the query to only return users who are available in a pool with one of the specified streams.
     * If $streams is empty, this scope will be ignored.
     */
    public function whereQualifiedInWorkStreamsIn(?array $streams): self
    {
        if (empty($streams)) {
            return $this;
        }

        return $this->whereHas('poolCandidates', function ($query) use ($streams) {
            $query->whereQualifiedInWorkStreamsIn($streams);
        });
    }

    /**
     * Scope Publishing Groups
     *
     * Restrict a query by specific publishing groups
     */
    public function wherePoolCandidatePublishingGroupsIn(?array $publishingGroups): self
    {
        // Early return if no publishing groups were supplied
        if (empty($publishingGroups)) {
            return $this;
        }

        return $this->whereHas('poolCandidates', function ($query) use ($publishingGroups) {
            $query->wherePublishingGroupsIn($publishingGroups);
        });
    }

    /**
     * Return users who have an available PoolCandidate in at least one IT pool.
     */
    public function whereHasTalentSearchablePublishingGroups($args): self
    {

        return $this->whereHas('poolCandidates', function ($innerQueryBuilder) use ($args) {
            $filters = Arr::get($args ?? [], 'where', []);

            $innerQueryBuilder->whereHas('pool', function ($query) use ($filters) {
                $query->wherePublished();

                if (array_key_exists('qualifiedInClassifications', $filters)) {
                    $query->whereClassifications($filters['qualifiedInClassifications']);
                }

                if (array_key_exists('qualifiedInWorkStreams', $filters)) {
                    $query->whereWorkStreamsIn($filters['qualifiedInWorkStreams']);
                }
            })
                ->whereAvailable()
                ->whereInTalentSearchablePublishingGroup();

            return $innerQueryBuilder;
        });
    }

    /**
     * Return users who have a PoolCandidate in a given community
     */
    public function whereHasPoolCandidateCommunity(?string $communityId): self
    {
        if (empty($communityId)) {
            return $this;
        }

        return $this->whereHas('poolCandidates', function ($query) use ($communityId) {
            return $query->whereHasPoolCandidateCommunity($communityId);
        });
    }

    public function whereHasDiploma(?bool $hasDiploma): self
    {
        if ($hasDiploma) {
            return $this->where('has_diploma', true);
        }

        return $this;
    }

    public function wherePositionDurationIn(?array $positionDuration): self
    {
        if (empty($positionDuration)) {
            return $this;
        }

        return $this->where(function ($query) use ($positionDuration) {
            foreach ($positionDuration as $index => $duration) {
                $query->orWhereJsonContains('position_duration', $duration);
            }
        });
    }

    public function whereEquityIn(?array $equity): self
    {
        if (empty($equity)) {
            return $this;
        }

        // OR filter - first find out how many booleans are true, create array of all true equity booleans
        // equity object has 4 keys with associated booleans
        $equityVars = [];
        if (array_key_exists('is_woman', $equity) && $equity['is_woman']) {
            array_push($equityVars, 'is_woman');
        }
        if (array_key_exists('has_disability', $equity) && $equity['has_disability']) {
            array_push($equityVars, 'has_disability');
        }
        if (array_key_exists('is_indigenous', $equity) && $equity['is_indigenous']) {
            array_push($equityVars, 'is_indigenous');
        }
        if (array_key_exists('is_visible_minority', $equity) && $equity['is_visible_minority']) {
            array_push($equityVars, 'is_visible_minority');
        }

        // 3 fields are booleans, one is a jsonb field
        return $this->where(function ($query) use ($equityVars) {
            foreach ($equityVars as $index => $equityInstance) {
                if ($equityInstance === 'is_indigenous') {
                    $query->orWhereJsonLength('indigenous_communities', '>', 0);
                } else {
                    $query->orWhere($equityVars[$index], true);
                }
            }
        });
    }

    public function wherePublicProfileSearch(?string $search): self
    {
        if ($search) {
            $this->where(function ($query) use ($search) {
                $query->whereName($search);
                $query->orWhere(function ($query) use ($search) {
                    $query->whereEmail($search);
                });
            });
        }

        return $this;
    }

    public function whereName(?string $name): self
    {
        if (! $name) {
            return $this;
        }

        $splitName = explode(' ', $name);

        return $this->where(function ($query) use ($splitName) {
            foreach ($splitName as $value) {
                $query->whereRaw("f_unaccent(first_name) ilike ('%' || f_unaccent(?) || '%')", $value)
                    ->orWhereRaw("f_unaccent(last_name) ilike ('%' || f_unaccent(?) || '%')", $value);
            }
        });
    }

    public function whereTelephone(?string $telephone): self
    {
        if (! $telephone) {
            return $this;
        }

        return $this->where('telephone', 'ilike', "%{$telephone}%");
    }

    public function whereEmail(?string $email): self
    {
        if (! $email) {
            return $this;
        }

        return $this->whereRaw("f_unaccent(email) ilike ('%' || f_unaccent(?) || '%')", $email);
    }

    public function whereWorkEmail(?string $email): self
    {
        if (! $email) {
            return $this;
        }

        return $this->whereRaw("f_unaccent(work_email) ilike ('%' || f_unaccent(?) || '%')", $email);
    }

    public function whereExactWorkEmail(string $email): self
    {
        return $this->whereRaw('LOWER("work_email") = ?', [strtolower($email)]);
    }

    public function whereIsGovEmployee(?bool $isGovEmployee): self
    {
        if (! $isGovEmployee) {
            return $this;
        }

        return $this->where('computed_is_gov_employee', true);
    }

    public function whereIsVerifiedGovEmployee(): self
    {
        return $this->where('computed_is_gov_employee', true)
            ->whereNotNull('work_email')
            ->whereNotNull('work_email_verified_at');
    }

    public function whereRoleIn(?array $roleIds): self
    {
        if (empty($roleIds)) {
            return $this;
        }

        return $this->where(function ($query) use ($roleIds) {
            $query->whereHas('roleAssignments', function ($query) use ($roleIds) {
                $query->whereIn('role_id', $roleIds);
            });
        });
    }

    public function whereClassificationIn(?array $classificationIds): self
    {
        if (empty($classificationIds)) {
            return $this;
        }

        return $this->whereHas('currentClassification', function (Builder $query) use ($classificationIds) {
            $query->whereIn('id', $classificationIds);
        });
    }

    public function whereCommunityWorkStreamsIn(?array $workStreamIds): self
    {
        if (empty($workStreamIds)) {
            return $this;
        }

        return $this->whereHas('communityInterests', function (Builder $interestQuery) use ($workStreamIds) {
            $interestQuery->where('consent_to_share_profile', true)
                ->whereHas('workStreams', function (Builder $streamQuery) use ($workStreamIds) {
                    $streamQuery->whereIn('community_interest_work_stream.work_stream_id', $workStreamIds);
                });
        });
    }

    public function whereCommunitiesIn(?array $communityIds): self
    {
        if (empty($communityIds)) {
            return $this;
        }

        return $this->whereHas('communityInterests', function (Builder $interestQuery) use ($communityIds) {
            $interestQuery->where('consent_to_share_profile', true)
                ->whereHas('community', function (Builder $communityQuery) use ($communityIds) {
                    $communityQuery->whereIn('id', $communityIds);
                });
        });
    }

    public function whereWfaInterestIn(?array $wfaInterests): self
    {
        if (empty($wfaInterests)) {
            return $this;
        }

        return $this->whereIn('wfa_interest', $wfaInterests);
    }

    public function whereHasPriorityEntitlement(?bool $hasPriority): self
    {
        if (! isset($hasPriority)) {
            return $this;
        }

        return $this->where('has_priority_entitlement', $hasPriority);
    }

    public function whereAuthorizedToView(?array $args = null): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        // can see any user - return with no filters added
        if ($user?->isAbleTo('view-any-user')) {
            return $this;
        }

        // we might want to add some filters for some users
        $filterCountBefore = count($this->getQuery()->wheres);

        $query = $this->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-applicantProfile')) {
                $query->orWhereHas('poolCandidates', function (Builder $query) use ($user) {
                    $allTeams = $user->rolesTeams()->get();
                    $teamIds = $allTeams->filter(function ($team) use ($user) {
                        return $user->isAbleTo('view-team-applicantProfile', $team);
                    })->pluck('id');

                    $query->whereHas('pool', function (Builder $query) use ($teamIds) {
                        $query
                            ->where('submitted_at', '<=', Carbon::now()->toDateTimeString())
                            ->where(function (Builder $query) use ($teamIds) {
                                $query
                                    ->whereHas('team', function (Builder $query) use ($teamIds) {
                                        return $query->whereIn('teams.id', $teamIds);
                                    })
                                    ->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                                        return $query->whereIn('teams.id', $teamIds);
                                    });
                            });
                    });
                });
            }

            if ($user?->isAbleTo('view-own-user')) {
                $query->orWhere('users.id', $user->id);
            }
        });

        $filterCountAfter = count($query->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return $query;
        }

        // fall through - return nothing
        return $this->where('users.id', null);
    }

    public function whereAuthorizedToViewBasicInfo(): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        // special case: can see any basic info - return all users with no filters added
        if ($user?->isAbleTo('view-any-userBasicInfo')) {
            return $this;
        }

        // otherwise: use the regular authorized to view scope
        return $this->whereAuthorizedToView();
    }

    /**
     * Used only for the WFA table
     *
     * User can only see profiles that have been shared with a community
     * they are a part of.
     */
    public function whereAuthorizedToViewEmployeeWFAAdminTable(): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if ($user?->isAbleTo('view-any-employeeWFA')) {
            return $this;
        }

        $filterCountBefore = count($this->getQuery()->wheres);
        $query = $this->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-employeeWFA')) {
                $allCommunityTeams = $user->rolesTeams()
                    ->where('teamable_type', "App\Models\Community")
                    ->get();
                $teamIds = $allCommunityTeams
                    ->filter(fn ($team) => $user->isAbleTo('view-team-employeeWFA', $team))->pluck('teamable_id')->toArray();

                // NOTE: We only want to show users who have added this community and consented to share profile
                // While users with this permission may see those who have applied to a process in their community
                // we do not want to show those by default
                $query->orWhereHas('communityInterests', function (Builder $commInterestQuery) use ($teamIds) {
                    // User has expressed interest in community
                    $commInterestQuery->whereIn('community_id', $teamIds)
                        ->where('consent_to_share_profile', true);
                });

                if ($user->isAbleTo('view-own-employeeWFA')) {
                    $query->orWhere('users.id', $user->id);
                }
            }
        });

        $filterCountAfter = count($query->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return $query;
        }

        // fall through - query will return nothing
        return $this->where('id', null);
    }

    // special scope for search page with custom logic to simultaneously handle WORK REGION and FLEXIBLE WORK LOCATION
    public function whereFlexibleLocationAndRegionSpecialMatching(?array $workRegions, ?array $flexibleLocations): self
    {
        if (! $workRegions && ! $flexibleLocations) {
            return $this;
        }

        // combine multiple orWhere statements to achieve desired outcome
        $this->where(function ($query) use ($workRegions, $flexibleLocations) {

            // if remote passed in, OR match all remote
            if ($flexibleLocations && in_array(FlexibleWorkLocation::REMOTE->name, $flexibleLocations)) {
                $query->orWhere(function ($query) {
                    $query->whereJsonContains('flexible_work_locations', FlexibleWorkLocation::REMOTE->name);
                });
            }

            // if hybrid passed in, OR match (HYBRID AND REGION)
            if ($flexibleLocations && in_array(FlexibleWorkLocation::HYBRID->name, $flexibleLocations)) {
                $query->orWhere(function ($query) use ($workRegions) {
                    $query->whereJsonContains('flexible_work_locations', FlexibleWorkLocation::HYBRID->name)
                        ->whereLocationPreferencesIn($workRegions); // this scope can handle empty work regions
                });
            }

            // if onsite passed in OR match (ONSITE AND REGION)
            if ($flexibleLocations && in_array(FlexibleWorkLocation::ONSITE->name, $flexibleLocations)) {
                $query->orWhere(function ($query) use ($workRegions) {
                    $query->whereJsonContains('flexible_work_locations', FlexibleWorkLocation::ONSITE->name)
                        ->whereLocationPreferencesIn($workRegions); // this scope can handle empty work regions
                });
            }

            // regions were passed in, no flexible locations so only filter off regions
            // likely impossible state
            if (! $flexibleLocations) {
                $query->whereLocationPreferencesIn($workRegions);
            }

        });

        return $this;
    }

    // Given input in the shape of UserFilterInput, adjust then call whereFlexibleLocationAndRegionSpecialMatching()
    public function whereUserFilterInputToSpecialLocationMatching(?array $filter): self
    {
        if (empty($filter)) {
            return $this;
        }

        if (array_key_exists('locationPreferences', $filter) || array_key_exists('flexibleWorkLocations', $filter)) {

            $workRegions = array_key_exists('locationPreferences', $filter) ? $filter['locationPreferences'] : null;
            $flexibleWorkLocations = array_key_exists('flexibleWorkLocations', $filter) ? $filter['flexibleWorkLocations'] : null;

            $this->whereFlexibleLocationAndRegionSpecialMatching($workRegions, $flexibleWorkLocations);

        }

        return $this;
    }

    public function whereGeneralSearch(?string $searchTerm): self
    {
        if ($searchTerm) {
            $combinedSearchTerm = trim(preg_replace('/\s{2,}/', ' ', $searchTerm));

            $this
                ->join('user_search_indices', 'users.id', '=', 'user_search_indices.id')
                // attach the tsquery to every row to use for filtering
                ->crossJoinSub(function ($query) use ($combinedSearchTerm) {
                    $query->selectRaw(
                        'websearch_to_tsquery(coalesce(?, get_current_ts_config()), ?)'.' AS tsquery',
                        [config('scout.pgsql.config'), $combinedSearchTerm]
                    );
                }, 'calculations')
                // add the calculated rank column to allow for ordering by text search rank
                ->addSelect(DB::raw('ts_rank(user_search_indices.searchable, calculations.tsquery) AS rank'))
                // Now that we have added a column, query builder no longer will add a * to the select.  Add all possible columns manually.
                ->addSelect(['users.*'])
                ->from('users');

            // negation setup
            preg_match_all('/(^|\s)[-!][^\s]+\b/', $combinedSearchTerm, $negationMatches);
            $matchesWithoutOperatorOrStartingSpace = array_map(fn ($string) => ltrim($string, " \-"), $negationMatches[0]); // 0th item is full matched
            $negationRemovedSearchTerm = preg_replace('/(^|\s)[-!][^\s]+\b/', '', $combinedSearchTerm);

            // remove text in quotation marks for partial matching
            $negationQuotedRemovedSearchTerm = preg_replace('/\"([^\"]*)\"/', '', $negationRemovedSearchTerm);

            // clear characters or search operators out, then array split for easy OR matching
            $filterToEmptySpace = ['"', '"', ':', '!'];
            $filterToSingleSpace = [' AND ', ' OR ', ' & '];
            $filtered = str_ireplace($filterToEmptySpace, '', $negationQuotedRemovedSearchTerm);
            $filtered = str_ireplace($filterToSingleSpace, ' ', $filtered);
            $whiteSpacingRemoved = trim($filtered);

            // if the remaining string is empty, don't turn into an array to avoid matching to ""
            $arrayed = $whiteSpacingRemoved === '' ? null : explode(' ', $whiteSpacingRemoved);

            // this scope combines two clauses with an OR so it needs to be wrapped
            $this->where(function ($query) use ($arrayed, $matchesWithoutOperatorOrStartingSpace) {

                // clause 1: filter rows against the tsquery
                $query->whereColumn('user_search_indices.searchable', '@@', 'calculations.tsquery');

                // clause 2: add "ilike" filters
                $query->orWhere(function ($ilikeSubquery) use ($arrayed, $matchesWithoutOperatorOrStartingSpace) {

                    // positive matching ilike filters
                    if (count($arrayed ?? []) > 0) {
                        $ilikeSubquery->where(function ($positiveIlikeSubquery) use ($arrayed) {
                            foreach ($arrayed as $term) {
                                $positiveIlikeSubquery
                                    ->orWhereRaw("f_unaccent(first_name) ilike ('%' || f_unaccent(?) || '%')", $term)
                                    ->orWhereRaw("f_unaccent(last_name) ilike ('%' || f_unaccent(?) || '%')", $term)
                                    ->orWhereRaw("f_unaccent(email) ilike ('%' || f_unaccent(?) || '%')", $term);
                            }
                        });
                    }

                    //  negative ilike filters
                    if (count($matchesWithoutOperatorOrStartingSpace) > 0) {
                        $ilikeSubquery->whereNot(function ($negativeIlikeSubquery) use ($matchesWithoutOperatorOrStartingSpace) {
                            foreach ($matchesWithoutOperatorOrStartingSpace as $term) {
                                $negativeIlikeSubquery
                                    ->orWhereRaw('f_unaccent(first_name) ilike f_unaccent(?)', $term)
                                    ->orWhereRaw('f_unaccent(last_name) ilike f_unaccent(?)', $term)
                                    ->orWhereRaw('f_unaccent(email) ilike f_unaccent(?)', $term);
                            }
                        });
                    }
                });

            });

        }

        return $this;
    }

    public function whereGeneralSearchBeta(?string $searchTerm): self
    {
        $queryTextPrefixMatch = PostgresTextSearch::searchStringToQueryText($searchTerm, PostgresTextSearchMatchingType::PREFIX);
        $queryTextExactMatch = PostgresTextSearch::searchStringToQueryText($searchTerm, PostgresTextSearchMatchingType::EXACT);

        if ($queryTextPrefixMatch && $queryTextExactMatch) {
            $this
                ->join('user_search_indices', 'users.id', '=', 'user_search_indices.id')
                // attach the queries to every row to use for filtering
                ->crossJoinSub(function ($query) use ($queryTextPrefixMatch, $queryTextExactMatch) {
                    $query->selectRaw(
                        'to_tsquery(coalesce(?, get_current_ts_config()), ?) AS prefix_match_query',
                        [config('scout.pgsql.config'), $queryTextPrefixMatch]
                    );
                    $query->selectRaw(
                        'to_tsquery(coalesce(?, get_current_ts_config()), ?) AS exact_match_query',
                        [config('scout.pgsql.config'), $queryTextExactMatch]
                    );
                }, 'calculations')
                // filter rows against the queries (OR)
                ->where(function ($query) {
                    $query->whereColumn('user_search_indices.searchable', '@@', 'calculations.prefix_match_query');
                    $query->orWhereColumn('user_search_indices.searchable', '@@', 'calculations.exact_match_query');
                })
                // add the calculated rank column to allow for ordering by text search rank
                // weighting the exact matches a little heavier
                ->addSelect(DB::raw(<<<'SQL'
                        (
                            (ts_rank(user_search_indices.searchable, calculations.prefix_match_query) * 0.9) +
                            (ts_rank(user_search_indices.searchable, calculations.exact_match_query) * 1.1)
                        ) / 2 AS search_rank
                        SQL))
                // Now that we have added a column, query builder no longer will add a * to the select.  Add all possible columns manually.
                ->addSelect(['users.*'])
                ->from('users')
                ->orderByDesc('search_rank');
        }

        return $this;
    }
}
