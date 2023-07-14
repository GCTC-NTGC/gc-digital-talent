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
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Support\Facades\DB;
use Laratrust\Contracts\LaratrustUser;
use Laratrust\Traits\HasRolesAndPermissions;
use Carbon\Carbon;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

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
 * @property array $legacy_roles
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
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property array $location_preferences
 * @property string $location_exemptions
 * @property array $expected_salary
 * @property array $position_duration
 * @property array $accepted_operational_requirements
 * @property string $gov_employee_type
 * @property int $priority_weight
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property string $indigenous_declaration_signature
 * @property array $indigenous_communities
 * @property string $preferred_language_for_interview
 * @property string $preferred_language_for_exam
 */

class User extends Model implements Authenticatable, LaratrustUser
{

    use Authorizable;
    use HasRolesAndPermissions;
    use HasFactory;
    use SoftDeletes;
    use AuthenticatableTrait;
    use Notifiable;
    use HasRelationships;

    protected $keyType = 'string';

    protected $casts = [
        'legacy_roles' => 'array',
        'location_preferences' => 'array',
        'expected_salary' => 'array',
        'accepted_operational_requirements' => 'array',
        'position_duration' => 'array',
        'indigenous_communities' => 'array',
    ];

    protected $fillable = [
        'email',
        'sub'
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
    /**
     * @deprecated
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('platform_admin');
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

    // A relationship to the custom roleAssignments pivot model
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    public function userSkills(): HasMany
    {
        return $this->hasMany(UserSkill::class, 'user_id');
    }
    public function skills()
    {
        return $this->hasManyDeepFromRelations($this->userSkills(), (new UserSkill())->skill());
    }
    // This method will add the specified skills to UserSkills if they don't exist yet.
    public function addSkills($skill_ids)
    {
        // If any of the skills already exist but are soft-deleted, restore them
        $this->userSkills()->withTrashed()->whereIn('skill_id', $skill_ids)->restore();
        // Create a basic UserSkill for any skills not yet related to this user.
        $existingSkillIds = $this->userSkills()->withTrashed()->pluck('skill_id');
        $newSkillIds = collect($skill_ids)->diff($existingSkillIds)->unique();
        foreach ($newSkillIds as $skillId) {
            $userSkill = new UserSkill();
            $userSkill->skill_id = $skillId;
            $this->userSkills()->save($userSkill);
        }
        // If this User instance continues to be used, ensure the in-memory instance has the updated skills.
        $this->refresh();
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
            is_null($this->attributes['preferred_language_for_interview']) or
            is_null($this->attributes['preferred_language_for_exam']) or
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
            empty($this->attributes['position_duration'])  or
            is_null($this->attributes['citizenship']) or
            is_null($this->attributes['armed_forces_status'])
        ) {
            return false;
        } else {
            return true;
        }
    }
    public static function scopeIsProfileComplete(Builder $query, ?bool $isProfileComplete): Builder
    {
        if ($isProfileComplete) {
            $query->whereNotNull('first_name');
            $query->whereNotNull('last_name');
            $query->whereNotNull('email');
            $query->whereNotNull('telephone');
            $query->whereNotNull('preferred_lang');
            $query->whereNotNull('preferred_language_for_interview');
            $query->whereNotNull('preferred_language_for_exam');
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
            $query->whereJsonLength('position_duration', '>', 0);
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
     * @param array $poolFilters Each pool filter must contain a poolId, and may contain expiryStatus, statuses, and suspendedStatus fields
     * @return Builder
     */
    public static function scopePoolFilters(Builder $query, ?array $poolFilters): Builder
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
                                if (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE) {
                                    $query->whereDate('expiry_date', '>=', date("Y-m-d"))
                                        ->orWhereNull('expiry_date');
                                } else if (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED) {
                                    $query->whereDate('expiry_date', '<', date("Y-m-d"));
                                }
                            });
                            if (array_key_exists('statuses', $filter) && !empty($filter['statuses'])) {
                                $query->whereIn('pool_candidates.pool_candidate_status', $filter['statuses']);
                            }
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == ApiEnums::CANDIDATE_SUSPENDED_FILTER_ACTIVE) {
                                    $query->where('suspended_at', '>=', Carbon::now())
                                        ->orWhereNull('suspended_at');
                                } else if (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == ApiEnums::CANDIDATE_SUSPENDED_FILTER_SUSPENDED) {
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
        return $query;
    }
    /**
     * Return applicants with PoolCandidates in any of the given pools.
     * Only consider pool candidates who are available,
     * ie not expired, with the AVAILABLE status, and the application is not suspended
     *
     * @param Builder $query
     * @param array $poolIds
     * @return Builder
     */
    public static function scopeAvailableInPools(Builder $query, ?array $poolIds): Builder
    {
        if (empty($poolIds)) {
            return $query;
        }
        $poolFilters = [];
        foreach ($poolIds as $index => $poolId) {
            $poolFilters[$index] = [
                'poolId' => $poolId,
                'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE,
                'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL],
                'suspendedStatus' => ApiEnums::CANDIDATE_SUSPENDED_FILTER_ACTIVE,
            ];
        }
        return self::scopePoolFilters($query, $poolFilters);
    }
    public static function scopeLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        if (empty($languageAbility)) {
            return $query;
        }

        // $languageAbility comes from enum LanguageAbility
        // filtering on fields looking_for_<english/french/bilingual>
        if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_ENGLISH) {
            $query->where('looking_for_english', true);
        }
        if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_FRENCH) {
            $query->where('looking_for_french', true);
        }
        if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_BILINGUAL) {
            $query->where('looking_for_bilingual', true);
        }
        return $query;
    }
    public static function scopeOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($operationalRequirements)) {
            return $query;
        }

        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
        $query->whereJsonContains('accepted_operational_requirements', $operationalRequirements);
        return $query;
    }
    public static function scopeLocationPreferences(Builder $query, ?array $workRegions): Builder
    {
        if (empty($workRegions)) {
            return $query;
        }
        // LocationPreferences acts as an OR filter. The query should return candidates willing to work in ANY of the workRegions.
        $query->where(function ($query) use ($workRegions) {
            foreach ($workRegions as $index => $workRegion) {
                if ($index === 0) {
                    // First iteration must use where instead of orWhere
                    $query->whereJsonContains('location_preferences', $workRegion);
                } else {
                    $query->orWhereJsonContains('location_preferences', $workRegion);
                }
            }
        });
        return $query;
    }

    /**
     * Skills filtering
     */
    public static function scopeSkillsIntersectional(Builder $query, ?array $skill_ids): Builder
    {
        if (empty($skill_ids)) {
            return $query;
        }

        // skills AND filtering. The query should only return candidates with ALL of the skills.
        foreach ($skill_ids as $skill_id) {
            $query->whereExists(function ($query) use ($skill_id) {
                $query->select(DB::raw('null'))
                    ->from('user_skills')
                    ->whereColumn('user_skills.user_id', 'users.id')
                    ->where('user_skills.skill_id', $skill_id);
            });
        }
        return $query;
    }
    public static function scopeSkillsAdditive(Builder $query, ?array $skill_ids): Builder
    {
        if (empty($skill_ids)) {
            return $query;
        }

        // skills OR filtering. The query should return candidates with ANY of the skills.
        $query->whereExists(function ($query) use ($skill_ids) {
            $query->select(DB::raw('null'))
                ->from('user_skills')
                ->whereColumn('user_skills.user_id', 'users.id')
                ->whereIn('user_skills.skill_id', $skill_ids);
        });
        return $query;
    }

    /**
     * Scopes the query to only return users who are available in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param Builder $query
     * @param array|null $classifications Each classification is an object with a group and a level field.
     * @return Builder
     */
    public static function scopeQualifiedClassifications(Builder $query, ?array $classifications): Builder
    {
        if (empty($classifications)) {
            return $query;
        }
        $query->whereHas('poolCandidates', function ($query) use ($classifications) {
            PoolCandidate::scopeQualifiedClassifications($query, $classifications);
        });
        return $query;
    }

    /**
     * Scopes the query to only return users who are available in a pool with one of the specified streams.
     * If $streams is empty, this scope will be ignored.
     *
     * @param Builder $query
     * @param array|null $streams
     * @return Builder
     */
    public static function scopeQualifiedStreams(Builder $query, ?array $streams): Builder
    {
        if (empty($streams)) {
            return $query;
        }

        $query->whereHas('poolCandidates', function ($query) use ($streams) {
            PoolCandidate::scopeQualifiedStreams($query, $streams);
        });
        return $query;
    }

    /**
     * scopeExpectedClassifications
     *
     * Scopes the query to only return applicants who have expressed interest in any of $classifications.
     * Applicants have been able to record this interest in various ways, so this scope may consider three fields on
     * the user: expectedClassifications, expectedSalary, and expectedGenericJobTitles.
     *
     * @param Builder $query
     * @param array|null $classifications Each classification is an object with a group and a level field.
     * @return Builder
     */
    public static function scopeExpectedClassifications(Builder $query, ?array $classifications): Builder
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
                self::filterByClassificationToSalary($query, $classifications);
            });
            $query->orWhere(function ($query) use ($classifications) {
                self::filterByClassificationToGenericJobTitles($query, $classifications);
            });
        });

        return $query;
    }
    public static function filterByClassificationToGenericJobTitles(Builder $query, ?array $classifications): Builder
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
    private static function filterByClassificationToSalary(Builder $query, ?array $classifications): Builder
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

    public static function scopeHasDiploma(Builder $query, ?bool $hasDiploma): Builder
    {
        if ($hasDiploma) {
            $query->where('has_diploma', true);
        }
        return $query;
    }

    public static function scopePositionDuration(Builder $query, ?array $positionDuration): Builder
    {
        if (empty($positionDuration)) {
            return $query;
        }

        $query->where(function ($query) use ($positionDuration) {
            foreach ($positionDuration as $index => $duration) {
                $query->orWhereJsonContains('position_duration', $duration);
            }
        });
        return $query;
    }

    public static function scopeEquity(Builder $query, ?array $equity): Builder
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

        // 3 fields are booleans, one is a jsonb field, isIndigenous = LEGACY_IS_INDIGENOUS
        $query->where(function ($query) use ($equityVars) {
            foreach ($equityVars as $index => $equityInstance) {
                if ($equityInstance === "is_indigenous") {
                    $query->orWhereJsonContains('indigenous_communities', ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS);
                } else {
                    $query->orWhere($equityVars[$index], true);
                }
            }
        });
        return $query;
    }

    public static function scopeGeneralSearch(Builder $query, ?string $search): Builder
    {
        if ($search) {
            $query->where(function ($query) use ($search) {
                self::scopeName($query, $search);
                $query->orWhere(function ($query) use ($search) {
                    self::scopeEmail($query, $search);
                });
                $query->orWhere(function ($query) use ($search) {
                    self::scopeTelephone($query, $search);
                });
            });
        }
        return $query;
    }

    public static function scopeName(Builder $query, ?string $name): Builder
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

    public static function scopeTelephone(Builder $query, ?string $telephone): Builder
    {
        if ($telephone) {
            $query->where('telephone', 'ilike', "%{$telephone}%");
        }
        return $query;
    }

    public static function scopeEmail(Builder $query, ?string $email): Builder
    {
        if ($email) {
            $query->where('email', 'ilike', "%{$email}%");
        }
        return $query;
    }

    public static function scopeIsGovEmployee(Builder $query, ?bool $isGovEmployee): Builder
    {
        if ($isGovEmployee) {
            $query->where('is_gov_employee', true);
        }
        return $query;
    }

    /* accessor to maintain functionality of deprecated wouldAcceptTemporary field */
    public function getWouldAcceptTemporaryAttribute()
    {
        $positionDuration = $this->position_duration;

        if ($positionDuration && in_array(ApiEnums::POSITION_DURATION_TEMPORARY, $positionDuration)) {
            return true;
        }

        if ($positionDuration && count($positionDuration) >= 1) {
            return false;
        }

        return null; // catch all other cases, like null variable or empty array
    }

    /* accessor to maintain functionality of to be deprecated isIndigenous field */
    public function getIsIndigenousAttribute()
    {
        $indigenousCommunities = $this->indigenous_communities;

        if ($indigenousCommunities && in_array(ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS, $indigenousCommunities)) {
            return true;
        }

        if (gettype($indigenousCommunities) == "array") {
            return false; // case for when the array exists but lacks the legacy value which would reverse to is_indigenous = false, or is empty
        }

        return null; // if indigenousCommunities is null then so is isIndigenous
    }

    /* accessor to maintain functionality of to be deprecated languageAbility field, its logic comes from migration drop_language_ability*/
    public function getLanguageAbilityAttribute($languageAbility = null)
    {
        // if the field exists, say for migration purposes, must stop accessor overriding
        if ($languageAbility !== null) {
            return $languageAbility;
        }

        $lookingForEnglish = $this->looking_for_english;
        $lookingForFrench = $this->looking_for_french;
        $lookingForBilingual = $this->looking_for_bilingual;

        // only english case
        if ($lookingForEnglish && !$lookingForFrench && !$lookingForBilingual) {
            return ApiEnums::LANGUAGE_ABILITY_ENGLISH;
        }

        // only french case
        if (!$lookingForEnglish && $lookingForFrench && !$lookingForBilingual) {
            return ApiEnums::LANGUAGE_ABILITY_FRENCH;
        }

        // bilingual case just depends on the one field being true
        // or ignore the field if english and french are both true
        if (($lookingForBilingual) || ($lookingForEnglish && $lookingForFrench)) {
            return ApiEnums::LANGUAGE_ABILITY_BILINGUAL;
        }

        // in all other cases the field stays null, so cases where all fields tested are false/null for instance
    }

    // Prepares the parameters for Laratrust and then calls the function to modify the roles
    private function callRolesFunction($rolesInput, $functionName)
    {
        // Laratrust doesn't recognize a string as an ID.  Therefore, we must convert the array of IDs to an array of key-value pairs where the key is 'id'.
        $roleIdObjects = array_map(function ($id) {
            return ['id' => $id];
        }, $rolesInput['roles']);

        // Laratrust doesn't recognize a string as an ID.  Therefore, we must convert the ID to a key-value pair where the key is 'id'.
        if (array_key_exists('team', $rolesInput))
            $teamIdObject = ['id' => $rolesInput['team']];
        else
            $teamIdObject = null;

        return $this->$functionName($roleIdObjects, $teamIdObject);
    }

    public function setRoleAssignmentsInputAttribute($roleAssignmentHasMany)
    {
        if (array_key_exists('attach', $roleAssignmentHasMany)) {
            $this->callRolesFunction($roleAssignmentHasMany['attach'], 'addRoles');
        }

        if (array_key_exists('detach', $roleAssignmentHasMany)) {
            $this->callRolesFunction($roleAssignmentHasMany['detach'], 'removeRoles');
        }

        if (array_key_exists('sync', $roleAssignmentHasMany)) {
            $this->callRolesFunction($roleAssignmentHasMany['sync'], 'syncRoles');
        }
    }

    // reattach all the extra fields from the JSON data column
    public static function enrichNotification(object $notification)
    {
        $dataFields = $notification->data;
        foreach ($dataFields as $key => $value) {
            $notification->$key = $value;
        }
    }

    // rename accessor to avoid hiding parent's notification function
    public function getEnrichedNotificationsAttribute()
    {
        $notifications = $this->notifications()->get();
        $notifications->each(function ($n) {
            self::enrichNotification($n);
        });
        return $notifications;
    }

    // rename accessor to avoid hiding parent's notification function
    public function getUnreadEnrichedNotificationsAttribute()
    {
        $notifications = $this->unreadNotifications()->get();
        $notifications->each(function ($n) {
            self::enrichNotification($n);
        });
        return $notifications;
    }
}
