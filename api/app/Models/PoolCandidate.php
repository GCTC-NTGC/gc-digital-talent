<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\UserResource;

/**
 * Class PoolCandidate
 *
 * @property int $id
 * @property string $cmo_identifier
 * @property Illuminate\Support\Carbon $expiry_date
 * @property boolean $is_woman
 * @property boolean $has_disability
 * @property boolean $is_indigenous
 * @property boolean $is_visible_minority
 * @property boolean $has_diploma
 * @property Illuminate\Support\Carbon $archived_at
 * @property Illuminate\Support\Carbon $submitted_at
 * @property string $language_ability
 * @property string $signature
 * @property array $location_preferences
 * @property array $expected_salary
 * @property string $pool_candidate_status
 * @property int $status_weight
 * @property int $pool_id
 * @property int $user_id
 * @property array $accepted_operational_requirements
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class PoolCandidate extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */

    protected $casts = [
        'expiry_date' => 'date',
        'archived_at' => 'datetime',
        'submitted_at' => 'datetime',
        'location_preferences' => 'array',
        'expected_salary' => 'array',
        'accepted_operational_requirements' => 'array',
        'profile_snapshot' => 'json'
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'archived_at',
        'submitted_at',
        'user_id',
        'pool_id',
        'signature',
        'profile_snapshot',
        'expiry_date',
        'pool_candidate_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }
    public function expectedClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_pool_candidate');
    }
    public function cmoAssets(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class);
    }


    public function scopeClassifications(Builder $query, ?array $classifications): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($classifications)) {
            return $query;
        }

        // Classifications act as an OR filter. The query should return candidates with any of the classifications.
        // A single whereHas clause for the relationship, containing multiple orWhere clauses accomplishes this.
        // mirroring functionality of the classification scope on the User model
        $query->where(function ($query) use ($classifications) {
            $query->whereHas('user', function ($query) use ($classifications) {
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
            });
        });

        return $query;
    }

    private function filterByClassificationToSalary(Builder $query, array $classifications): Builder
    {
        // When managers search for a classification, also return any users whose expected salary
        // ranges overlap with the min/max salaries of any of those classifications.
        // Since salary ranges are text enums a custom SQL subquery is used to convert them to
        // numeric values and compare them to specified classifications

        // This subquery only works for a non-zero number of filter classifications.
        // If passed zero classifications then return same query builder unchanged.
        if (count($classifications) == 0)
            return $query;

        $parameters = [];
        $sql = <<<RAWSQL1

SELECT NULL    -- find all candidates where a salary/group combination matches a classification filter
  FROM (
    SELECT    -- convert salary ranges to numeric min/max values
      t.candidate_id,
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
        pc.id candidate_id,
        JSONB_ARRAY_ELEMENTS_TEXT(pc.expected_salary) salary_range_id
      FROM pool_candidates pc
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
  AND u.candidate_id = "pool_candidates".id

RAWSQL2;

        return $query->whereRaw('EXISTS (' . $sql . ')', $parameters);
    }

    public function filterByOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($operationalRequirements)) {
            return $query;
        }

        // OperationalRequirements act as an AND filter. The query should only return candidates willing to accept ALL of the requirements.
        $query->whereExists(function ($query) use ($operationalRequirements) {
            $query->select('id')
            ->from('users')
            ->whereColumn('users.id', 'pool_candidates.user_id')
            ->whereJsonContains('accepted_operational_requirements', $operationalRequirements);
        });

        return $query;
    }
    public function filterByLocationPreferences(Builder $query, ?array $workRegions): Builder
    {
        if (empty($workRegions)) {
            return $query;
        }

        // WorkRegion acts as an OR filter. The query should return candidates willing to work in ANY of the regions.
        $query->whereExists(function ($query) use ($workRegions) {
            $query->select('id')
            ->from('users')
            ->whereColumn('users.id', 'pool_candidates.user_id')
            ->where(function ($query) use ($workRegions) {
                foreach ($workRegions as $index => $region) {
                    if ($index === 0) {
                        // First iteration must use where instead of orWhere
                        $query->whereJsonContains('location_preferences', $region);
                    } else {
                        $query->orWhereJsonContains('location_preferences', $region);
                    }
                }
            });
        });
        return $query;
    }
    public function filterByLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        if (empty($languageAbility)) {
            return $query;
        }

        // If filtering for a specific language the query should return candidates of that language OR bilingual.
        $query->whereExists(function ($query) use ($languageAbility) {
            $query->select('id')
            ->from('users')
            ->whereColumn('users.id', 'pool_candidates.user_id')
            ->where(function ($query) use ($languageAbility) {
                $query->where('language_ability', $languageAbility);
                if ($languageAbility == ApiEnums::LANGUAGE_ABILITY_ENGLISH || $languageAbility == ApiEnums::LANGUAGE_ABILITY_FRENCH) {
                    $query->orWhere('language_ability', ApiEnums::LANGUAGE_ABILITY_BILINGUAL);
                }
            });

        });
        return $query;
    }
    public static function filterByPools(Builder $query, ?array $pools): Builder
    {
        if (empty($pools)) {
            return $query;
        }

        // Pool acts as an OR filter. The query should return candidates in ANY of the pools.
        $poolIds = [];
        foreach ($pools as $pool) {
            array_push($poolIds, $pool['id']);
        }
        $query->whereIn('pool_id', $poolIds);
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
        // assert indigenousCommunities was passed in, and that it isn't a null array, and then lastly check for the LEGACY enum
        // if all true then this filter is added
        if (array_key_exists("indigenous_communities", $equity)
            && $equity["indigenous_communities"]
            && in_array(ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS, $equity["indigenous_communities"])
            ) {
            array_push($equityVars, "is_indigenous");
        };
        if (array_key_exists("is_visible_minority", $equity) && $equity["is_visible_minority"]) {
            array_push($equityVars, "is_visible_minority");
        };

        // then return queries depending on above array count, special query syntax needed for multiple ORs to ensure proper SQL query formed
        $query->whereExists(function ($query) use ($equityVars) {
            $query->select('id')
                ->from('users')
                ->whereColumn('users.id', 'pool_candidates.user_id')
                ->where(function ($query) use ($equityVars) {
                    foreach ($equityVars as $index => $equityInstance) {
                        if ($equityInstance === "is_indigenous") {
                            $query->orWhereJsonContains('indigenous_communities', ApiEnums::INDIGENOUS_LEGACY_IS_INDIGENOUS);
                        } else {
                            $query->orWhere($equityVars[$index], true);
                        }
                    }
                });
        });
        return $query;
    }

    public function filterByGeneralSearch(Builder $query, ?string $search): Builder
    {
        // used App\\Models\\User@filterByPools as reference
        if ($search) {
            $query->whereExists(function ($query) use ($search) {
                $query->select('id')
                    ->from('users')
                    ->whereColumn('users.id', 'pool_candidates.user_id')
                    ->where(function ($query) use ($search) {
                        $query->where('users.first_name', "ilike", "%{$search}%")
                            ->orWhere('users.last_name', "ilike", "%{$search}%")
                            ->orWhere('users.email', "ilike", "%{$search}%");
                    });
            });
        }

        return $query;
    }

    public static function filterByName(Builder $query, ?string $name): Builder
    {
        if ($name) {
            $splitName = explode(" ", $name);
            $query->whereExists(function ($query) use ($splitName) {
                $query->select('id')
                    ->from('users')
                    ->whereColumn('users.id', 'pool_candidates.user_id')
                    ->where(function ($query) use ($splitName) {
                        foreach ($splitName as $index => $value) {
                            $query->where('first_name', "ilike", "%{$value}%")
                                ->orWhere('last_name', "ilike", "%{$value}%");
                        }
                    });
            });
        }
        return $query;
    }

    public static function scopeEmail(Builder $query, ?string $email): Builder
    {
        if ($email) {
            $query->whereExists(function ($query) use ($email) {
                $query->select('id')
                    ->from('users')
                    ->whereColumn('users.id', 'pool_candidates.user_id')
                    ->where(function ($query) use ($email) {
                        $query->where('email', 'ilike', "%{$email}%");
                    });
            });
        }
        return $query;
    }


    public function scopePoolCandidateStatuses(Builder $query, ?array $poolCandidateStatuses): Builder
    {
        if (empty($poolCandidateStatuses)) {
            return $query;
        }

        $query->whereIn('pool_candidate_status', $poolCandidateStatuses);
        return $query;
    }

    public static function scopeAvailable(Builder $query): Builder
    {
        return $query->whereIn('pool_candidate_status', [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL]);
    }

    public function scopeHasDiploma(Builder $query, ?bool $hasDiploma): Builder
    {
        if ($hasDiploma) {
            $query->whereExists(function ($query) {
                $query->select('id')
                    ->from('users')
                    ->whereColumn('users.id', 'pool_candidates.user_id')
                    ->where(function ($query) {
                        $query->where('has_diploma', true);
                    });
                });
        }
        return $query;
    }

    public static function scopeExpiryFilter(Builder $query, ?array $args)
    {
        $expiryStatus = isset($args['expiryStatus']) ? $args['expiryStatus'] : ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE;
        if ($expiryStatus == ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE) {
            $query->where(function ($query) {
                $query->whereDate('expiry_date', '>=', date("Y-m-d"))
                    ->orWhereNull('expiry_date');
            });
        } else if ($expiryStatus == ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED) {
            $query->whereDate('expiry_date', '<', date("Y-m-d"));
        }
        return $query;
    }

    public function scopeNotDraft(Builder $query): Builder
    {
        return $query->whereNotIn('pool_candidate_status', ['DRAFT', 'DRAFT_EXPIRED']);
    }

   /* accessor to obtain pool candidate status, additional logic exists to override database field sometimes*/
   // pool_candidate_status database value passed into accessor as an argument
   public function getPoolCandidateStatusAttribute($candidateStatus)
   {
        // pull info
        $submittedAt = $this->submitted_at;
        $expiryDate = $this->expiry_date;
        $currentTime = date("Y-m-d H:i:s");
        $isExpired = $currentTime > $expiryDate ? true : false;

        // // ensure null submitted_at returns either draft or expired draft
        // if ($submittedAt == null){
        //     if($isExpired) {
        //         return ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED;
        //     }
        //     return ApiEnums::CANDIDATE_STATUS_DRAFT;
        // }

        // // ensure expired returned if past expiry date with exception for PLACED
        // if ($candidateStatus != ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL && $candidateStatus != ApiEnums::CANDIDATE_STATUS_PLACED_TERM && $candidateStatus != ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE) {
        //     if ($isExpired) {
        //         return ApiEnums::CANDIDATE_STATUS_EXPIRED;
        //     }
        //     return $candidateStatus;
        // }

        // no overriding
        return $candidateStatus;
    }

    public function createSnapshot()
    {
        if ($this->profile_snapshot) {
            return null;
        }

        $user = User::with([
            'department',
            'currentClassification',
            'expectedClassifications',
            'expectedGenericJobTitles',
            'cmoAssets',
            'awardExperiences',
            'communityExperiences',
            'educationExperiences',
            'personalExperiences',
            'workExperiences'
        ])->findOrFail($this->user_id);
        $profile = new UserResource($user);

        $this->profile_snapshot = $profile;
        $this->save();
    }

    public function scopePriorityWeight(Builder $query, ?array $priorityWeights): Builder
    {
        if (empty($priorityWeights)) {
            return $query;
        }

        $query->whereExists(function ($query) use ($priorityWeights) {
            $query->select('id')
                ->from('users')
                ->whereColumn('users.id', 'pool_candidates.user_id')
                ->where(function ($query) use ($priorityWeights) {
                    foreach ($priorityWeights as $index => $priorityWeight) {
                        if ($index === 0) {
                            // First iteration must use where instead of orWhere, as seen in filterWorkRegions
                            $query->where("priority_weight", $priorityWeight);
                        } else {
                            $query->orWhere("priority_weight", $priorityWeight);
                        }
                    }
                });
        });
        return $query;
    }

    // TODO: Deprecate CMO Assets filter after FEATURE_APPLICANTSEARCH flag is turned on.
    public function filterByCmoAssets(Builder $query, ?array $cmoAssets): Builder
    {
        if (empty($cmoAssets)) {
            return $query;
        }

        // CmoAssets act as an AND filter. The query should only return candidates with ALL of the assets.
        // This is accomplished with multiple whereHas clauses for the cmoAssets relationship.
        foreach ($cmoAssets as $cmoAsset) {
            $query->whereHas('cmoAssets', function ($query) use ($cmoAsset) {
                $query->where('key', $cmoAsset['key']);
            });
        }
        return $query;
    }
}
