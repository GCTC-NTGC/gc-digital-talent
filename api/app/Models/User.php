<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

/**
 * Class User
 *
 * @property string $id
 * @property string $email
 * @property string $sub
 * @property string $first_name
 * @property string $last_name
 * @property string $telephone
 * @property string $preferred_lang
 * @property array $roles
 * @property string $job_looking_status
 * @property string $current_province
 * @property string $current_city
 * @property boolean $looking_for_english
 * @property boolean $looking_for_french
 * @property boolean $looking_for_bilingual
 * @property string $bilingual_evaluation
 * @property string $comprehension_level
 * @property string $written_level
 * @property string $verbal_level
 * @property string $estimated_language_ability
 * @property string $is_gov_employee
 * @property boolean $has_priority_entitlement
 * @property string $priority_number
 * @property string $department
 * @property string $current_classification
 * @property string $citizenship
 * @property string $armed_forces_status
 * @property boolean $is_woman
 * @property boolean $has_disability
 * @property boolean $is_indigenous
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property string $language_ability
 * @property array $location_preferences
 * @property string $location_exemptions
 * @property array $expected_salary
 * @property boolean $would_accept_temporary
 * @property array $accepted_operational_requirements
 * @property string $gov_employee_type
 * @property int $priority_weight
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class User extends Model implements Authenticatable
{
    use HasFactory;
    use SoftDeletes;
    use AuthenticatableTrait;

    protected $keyType = 'string';

    protected $casts = [
        'roles' => 'array',
        'location_preferences' => 'array',
        'expected_salary' => 'array',
        'accepted_operational_requirements' => 'array',
    ];

    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }
    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, "department");
    }
    public function currentClassification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, "current_classification");
    }
    public function expectedClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_user')->withTimestamps();
    }
    public function expectedGenericJobTitles(): BelongsToMany
    {
        return $this->belongsToMany(GenericJobTitle::class, 'generic_job_title_user')->withTimestamps();
    }
    public function cmoAssets(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class)->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return is_array($this->roles) && in_array('ADMIN', $this->roles);
    }

    // All the relationships for experiences
    public function awardExperiences(): HasMany
    {
        return $this->hasMany(AwardExperience::class);
    }
    public function communityExperiences(): HasMany
    {
        return $this->hasMany(CommunityExperience::class);
    }
    public function educationExperiences(): HasMany
    {
        return $this->hasMany(EducationExperience::class);
    }
    public function personalExperiences(): HasMany
    {
        return $this->hasMany(PersonalExperience::class);
    }
    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }
    public function getExperiencesAttribute()
    {
        $collection = collect();
        $collection = $collection->merge($this->awardExperiences);
        $collection = $collection->merge($this->communityExperiences);
        $collection = $collection->merge($this->educationExperiences);
        $collection = $collection->merge($this->personalExperiences);
        $collection = $collection->merge($this->workExperiences);
        return $collection;
    }

    // getIsProfileCompleteAttribute function is correspondent to isProfileComplete attribute in graphql schema
    public function getIsProfileCompleteAttribute(): bool
    {
        if (
            is_null($this->attributes['first_name']) or
            is_null($this->attributes['last_name']) or
            is_null($this->attributes['email']) or
            is_null($this->attributes['telephone']) or
            is_null($this->attributes['preferred_lang']) or
            is_null($this->attributes['current_province']) or
            is_null($this->attributes['current_city']) or
            (is_null($this->attributes['looking_for_english']) &&
                is_null($this->attributes['looking_for_french']) &&
                is_null($this->attributes['looking_for_bilingual'])
            ) or
            is_null($this->attributes['is_gov_employee']) or
            is_null($this->attributes['has_priority_entitlement']) or
            is_null($this->attributes['location_preferences']) or
            empty($this->attributes['location_preferences']) or
            is_null($this->attributes['would_accept_temporary']) or
            is_null($this->attributes['citizenship']) or
            is_null($this->attributes['armed_forces_status']) or
            $this->expectedGenericJobTitles->isEmpty()
        ) {
            return false;
        } else {
            return true;
        }
    }
    public function scopeIsProfileComplete(Builder $query, ?bool $isProfileComplete): Builder
    {
        if ($isProfileComplete) {
            $query->whereNotNull('first_name');
            $query->whereNotNull('last_name');
            $query->whereNotNull('email');
            $query->whereNotNull('telephone');
            $query->whereNotNull('preferred_lang');
            $query->whereNotNull('current_province');
            $query->whereNotNull('current_city');
            $query->where(function ($query) {
                $query->whereNotNull('looking_for_english');
                $query->orWhereNotNull('looking_for_french');
                $query->orWhereNotNull('looking_for_bilingual');
            });
            $query->whereNotNull('is_gov_employee');
            $query->whereNotNull('has_priority_entitlement');
            $query->whereNotNull('location_preferences');
            $query->whereJsonLength('location_preferences', '>', 0);
            $query->whereNotNull('would_accept_temporary');
            $query->has('expectedGenericJobTitles');
            $query->whereNotNull('citizenship');
            $query->whereNotNull('armed_forces_status');
        }
        return $query;
    }

    /**
     * Boot function for using with User Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
    }

    // Search filters

    /**
     * Filters users by the Pools they are in.
     *
     * @param Builder $query
     * @param array $poolFilters Each pool filter must contain a poolId, and may contain expiryStatus and statuses fields.
     * @return Builder
     */
    public function filterByPools(Builder $query, ?array $poolFilters): Builder
    {
        if (empty($poolFilters)) {
            return $query;
        }

        // Pool acts as an OR filter. The query should return valid candidates in ANY of the pools.
        $query->whereExists(function ($query) use ($poolFilters) {
            $query->select('id')
                ->from('pool_candidates')
                ->whereColumn('pool_candidates.user_id', 'users.id')
                ->where(function ($query) use ($poolFilters) {
                    $makePoolFilterClause = function ($filter) {
                        return function ($query) use ($filter) {
                            $query->where('pool_candidates.pool_id', $filter['poolId']);
                            $query->where(function ($query) use ($filter) {
                                if ($filter['expiryStatus'] == ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE) {
                                    $query->whereDate('expiry_date', '>=', date("Y-m-d"))
                                    ->orWhereNull('expiry_date');
                                } else if (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED) {
                                    $query->whereDate('expiry_date', '<', date("Y-m-d"));
                                }
                            });
                            if (array_key_exists('statuses', $filter) && !empty($filter['statuses'])) {
                                $query->whereIn('pool_candidates.pool_candidate_status', $filter['statuses']);
                            }
                            return $query;
                        };
                    };
                    foreach($poolFilters as $index => $filter) {
                        if ($index == 0) {
                            $query->where($makePoolFilterClause($filter));
                        } else {
                            $query->orWhere($makePoolFilterClause($filter));
                        }
                    }
                    return $query;
                });
        });
        return $query;
    }
    /**
     * Return applicants with PoolCandidates in any of the given pools.
     * Only consider pool candidates who still available,
     * ie not expired and with the AVAILABLE status.
     *
     * @param Builder $query
     * @param array $poolIds
     * @return Builder
     */
    public function filterByAvailableInPools(Builder $query, ?array $poolIds): Builder
    {
        if (empty($poolIds)) {
            return $query;
        }
        $poolFilters = [];
        foreach ($poolIds as $index => $poolId) {
            $poolFilters[$index] = [
                'poolId' => $poolId,
                'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE,
                'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE]
            ];
        }
        return $this->filterByPools($query, $poolFilters);
    }
    public function filterByLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        // If filtering for a specific language the query should return candidates of that language OR bilingual.
        $query->where(function ($query) use ($languageAbility) {
            $query->where('language_ability', $languageAbility);
            if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_ENGLISH || $languageAbility == ApiEnums::LANGUAGE_ABILITY_FRENCH) {
                $query->orWhere('language_ability', ApiEnums::LANGUAGE_ABILITY_BILINGUAL);
            }
        });
        return $query;
    }
    public function filterByOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($operationalRequirements)) {
            return $query;
        }

        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
        $query->whereJsonContains('accepted_operational_requirements', $operationalRequirements);
        return $query;
    }
    public function filterByLocationPreferences(Builder $query, array $locations): Builder
    {
        if (empty($locations)) {
            return $query;
        }
        // LocationPreferences acts as an OR filter. The query should return candidates willing to work in ANY of the locations.
        $query->where(function ($query) use ($locations) {
            foreach ($locations as $index => $location) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->whereJsonContains('location_preferences', $location);
                } else {
                    $query->orWhereJsonContains('location_preferences', $location);
                }
            }
        });
        return $query;
    }
    public function filterByJobLookingStatus(Builder $query, ?array $statuses): Builder
    {
        if (empty($statuses)) {
            return $query;
        }
        // JobLookingStatus acts as an OR filter. The query should return users with ANY of the statuses.
        $query->where(function ($query) use ($statuses) {
            foreach ($statuses as $index => $status) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->where('job_looking_status', $status);
                } else {
                    $query->orWhere('job_looking_status', $status);
                }
            }
        });
        return $query;
    }
    public function filterBySkills(Builder $query, ?array $skills): Builder
    {
        if (empty($skills)) {
            return $query;
        }

        // skills act as an AND filter. The query should only return candidates with ALL of the skills.
        $query->whereExists(function ($query) use ($skills) {
            $query->select(DB::raw('null'))
                ->from(function ($query) {
                    $query->selectRaw('experiences.user_id, jsonb_agg(experience_skill.skill_id) as user_skills_grouped')
                        ->from('experience_skill')
                        ->joinSub(function ($query) {
                            $query->select('award_experiences.id as experience_id', 'award_experiences.user_id')
                                ->from('award_experiences')
                                ->unionAll(function ($query) {
                                    $query->select('community_experiences.id as experience_id', 'community_experiences.user_id')
                                        ->from('community_experiences');
                                })
                                ->unionAll(function ($query) {
                                    $query->select('education_experiences.id as experience_id', 'education_experiences.user_id')
                                        ->from('education_experiences');
                                })
                                ->unionAll(function ($query) {
                                    $query->select('personal_experiences.id as experience_id', 'personal_experiences.user_id')
                                        ->from('personal_experiences');
                                })
                                ->unionAll(function ($query) {
                                    $query->select('work_experiences.id as experience_id', 'work_experiences.user_id')
                                        ->from('work_experiences');
                                });
                        }, 'experiences', function ($join) {
                            $join->on('experience_skill.experience_id', '=', 'experiences.experience_id');
                        })
                        ->groupBy('experiences.user_id');
                }, "aggregate_experiences")
                ->whereJsonContains('aggregate_experiences.user_skills_grouped', $skills)
                ->whereColumn('aggregate_experiences.user_id', 'users.id');
        });
        return $query;
    }
    public function scopeClassifications(Builder $query, ?array $classifications): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($classifications)) {
            return $query;
        }

        // Classifications act as an OR filter. The query should return candidates with any of the classifications.
        // A single whereHas clause for the relationship, containing multiple orWhere clauses accomplishes this.
        $query->where(function ($query) use ($classifications) {
            $query->whereHas('expectedClassifications', function ($query) use ($classifications) {
                foreach ($classifications as $index => $classification) {
                    if ($index === 0) {
                        // First iteration must use where instead of orWhere
                        $query->where(function ($query) use ($classification) {
                            $query->where('group', $classification['group'])->where('level', $classification['level']);
                        });
                    } else {
                        $query->orWhere(function ($query) use ($classification) {
                            $query->where('group', $classification['group'])->where('level', $classification['level']);
                        });
                    }
                }
            });
            $query->orWhere(function ($query) use ($classifications) {
                $this->filterByClassificationToSalary($query, $classifications);
            });
            $query->orWhere(function ($query) use ($classifications) {
                $this->filterByClassificationToGenericJobTitles($query, $classifications);
            });
        });

        return $query;
    }
    public function filterByClassificationToGenericJobTitles(Builder $query, ?array $classifications): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($classifications)) {
            return $query;
        }
        // Classifications act as an OR filter. The query should return candidates with any of the classifications.
        // A single whereHas clause for the relationship, containing multiple orWhere clauses accomplishes this.

        // group these in a subquery to properly handle "OR" condition
        $query->whereHas('expectedGenericJobTitles', function ($query) use ($classifications) {
            $query->whereHas('classification', function ($query) use ($classifications) {
                foreach ($classifications as $index => $classification) {
                    if ($index === 0) {
                        // First iteration must use where instead of orWhere
                        $query->where(function ($query) use ($classification) {
                            $query->where('group', $classification['group'])->where('level', $classification['level']);
                        });
                    } else {
                        $query->orWhere(function ($query) use ($classification) {
                            $query->where('group', $classification['group'])->where('level', $classification['level']);
                        });
                    }
                }
            });
        });

        return $query;
    }
    private function filterByClassificationToSalary(Builder $query, ?array $classifications): Builder
    {
        // When managers search for a classification, also return any users whose expected salary
        // ranges overlap with the min/max salaries of any of those classifications.
        // Since salary ranges are text enums a custom SQL subquery is used to convert them to
        // numeric values and compare them to specified classifications

        // This subquery only works for a non-zero number of filter classifications.
        // If passed zero classifications then return same query builder unchanged.
        if (empty($classifications)) {
            return $query;
        }

        $parameters = [];
        $sql = <<<RAWSQL1

SELECT NULL    -- find all candidates where a salary/group combination matches a classification filter
  FROM (
    SELECT    -- convert salary ranges to numeric min/max values
      t.user_id,
      CASE t.salary_range_id
        WHEN '_50_59K' THEN 50000
        WHEN '_60_69K' THEN 60000
        WHEN '_70_79K' THEN 70000
        WHEN '_80_89K' THEN 80000
        WHEN '_90_99K' THEN 90000
        WHEN '_100K_PLUS' THEN 100000
      END min_salary,
      CASE t.salary_range_id
        WHEN '_50_59K' THEN 59999
        WHEN '_60_69K' THEN 69999
        WHEN '_70_79K' THEN 79999
        WHEN '_80_89K' THEN 89999
        WHEN '_90_99K' THEN 99999
        WHEN '_100K_PLUS' THEN 2147483647
      END max_salary
    FROM (
      SELECT    -- find all salary ranges for each candidate
        users.id user_id,
        JSONB_ARRAY_ELEMENTS_TEXT(users.expected_salary) salary_range_id
      FROM users
    ) t
  ) u
  JOIN classifications c ON
    c.max_salary >= u.min_salary
    AND c.min_salary <= u.max_salary
  WHERE (

RAWSQL1;

        foreach ($classifications as $index => $classification) {
            if ($index === 0) {
                // First iteration must use where instead of orWhere
                $sql .= '(c.group = ? AND c.level = ?)';
            } else {
                $sql .= ' OR (c.group = ? AND c.level = ?)';
            }
            array_push($parameters, [$classification['group'], $classification['level']]);
        }

        $sql .= <<<RAWSQL2
  )
  AND u.user_id = "users".id

RAWSQL2;

        return $query->whereRaw('EXISTS (' . $sql . ')', $parameters);
    }

    public function scopeHasDiploma(Builder $query, ?bool $hasDiploma): Builder
    {
        if ($hasDiploma) {
            $query->where('has_diploma', true);
        }
        return $query;
    }
    public function scopeWouldAcceptTemporary(Builder $query, ?bool $wouldAcceptTemporary): Builder
    {
        if ($wouldAcceptTemporary) {
            $query->where('would_accept_temporary', true);
        }
        return $query;
    }


    public function filterByEquity(Builder $query, ?array $equity): Builder
    {
        if (empty($equity)) {
            return $query;
        }

        // OR filter - first find out how many booleans are true, create array of all true equity bools
        // equity object has 4 keys with associated bools
        $equityVars = [];
        if (array_key_exists("is_woman", $equity) && $equity["is_woman"]) {
            array_push($equityVars, "is_woman");
        };
        if (array_key_exists("has_disability", $equity) && $equity["has_disability"]) {
            array_push($equityVars, "has_disability");
        };
        if (array_key_exists("is_indigenous", $equity) && $equity["is_indigenous"]) {
            array_push($equityVars, "is_indigenous");
        };
        if (array_key_exists("is_visible_minority", $equity) && $equity["is_visible_minority"]) {
            array_push($equityVars, "is_visible_minority");
        };

        // then return queries depending on above array count, special query syntax needed for multiple ORs to ensure proper SQL query formed
        $query->where(function ($query) use ($equityVars) {
            foreach ($equityVars as $index => $equityInstance) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere, as seen in filterWorkRegions
                    $query->where($equityVars[$index], true);
                } else {
                    $query->orWhere($equityVars[$index], true);
                }
            }
        });
        return $query;
    }

    public function filterByGeneralSearch(Builder $query, ?string $search): Builder
    {
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('first_name', "ilike", "%{$search}%")
                    ->orWhere('last_name', "ilike", "%{$search}%")
                    ->orWhere('email', "ilike", "%{$search}%")
                    ->orWhere('telephone', "ilike", "%{$search}%");
            });
        }
        return $query;
    }

    public function filterByName(Builder $query, ?string $name): Builder
    {
        if ($name) {
            $splitName = explode(" ", $name);
            $query->where(function ($query) use ($splitName) {
                foreach ($splitName as $index => $value) {
                    $query->where('first_name', "ilike", "%{$value}%")
                        ->orWhere('last_name', "ilike", "%{$value}%");
                }
            });
        }
        return $query;
    }

    public function scopeTelephone(Builder $query, ?string $telephone): Builder
    {
        if ($telephone) {
            $query->where('telephone', 'ilike', "%{$telephone}%");
        }
        return $query;
    }

    public function scopeEmail(Builder $query, ?string $email): Builder
    {
        if ($email) {
            $query->where('email', 'ilike', "%{$email}%");
        }
        return $query;
    }

    public function scopeIsGovEmployee(Builder $query, ?bool $isGovEmployee): Builder
    {
        if ($isGovEmployee) {
            $query->where('is_gov_employee', true);
        }
        return $query;
    }

    /**
     * Restrict the query to users who are either Actively Looking for or Open to opportunities.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeAvailableForOpportunities(Builder $query): Builder
    {
        $query->whereIn('job_looking_status', [ApiEnums::USER_STATUS_ACTIVELY_LOOKING, ApiEnums::USER_STATUS_OPEN_TO_OPPORTUNITIES]);
        return $query;
    }
}
