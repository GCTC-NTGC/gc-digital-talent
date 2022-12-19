<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\UserResource;

/**
 * Class PoolCandidate
 *
 * @property int $id
 * @property string $cmo_identifier
 * @property Illuminate\Support\Carbon $expiry_date
 * @property Illuminate\Support\Carbon $archived_at
 * @property Illuminate\Support\Carbon $submitted_at
 * @property string $signature
 * @property string $pool_candidate_status
 * @property int $status_weight
 * @property int $pool_id
 * @property int $user_id
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

    public function scopeClassifications(Builder $query, ?array $classifications): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($classifications)) {
            return $query;
        }

        // pointing to the classification scope on the User model
        // that scope also contains filterByClassificationToSalary and filterByClassificationToGenericJobTitles
        $query->whereHas('user', function ($query) use ($classifications) {
                User::scopeClassifications($query, $classifications);
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

        // point at filter on User
        $query->whereHas('user', function ($query) use ($languageAbility) {
            User::filterByLanguageAbility($query, $languageAbility);
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
        if (array_key_exists("is_indigenous", $equity) && $equity["is_indigenous"]) {
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

        // collect skills attached to the Pool to pass into resource collection
        $pool = Pool::with([
            'essentialSkills',
            'nonessentialSkills'
        ])->findOrFail($this->pool_id);
        $essentialSkillIds = $pool->essentialSkills()->pluck('id')->toArray();
        $nonessentialSkillIds = $pool->nonessentialSkills()->pluck('id')->toArray();
        $poolSkillIds = array_merge($essentialSkillIds, $nonessentialSkillIds);

        $profile = new UserResource($user);
        $profile = $profile->poolSkillIds($poolSkillIds);

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

    // TODO: Remove CMO Assets filter after filterByCmoAssets no longer used anywhere
    public function filterByCmoAssets(Builder $query, ?array $cmoAssets): Builder
    {
        if (empty($cmoAssets)) {
            return $query;
        }

        // mirroring the logic of scopeClassifications to access a pivot thru USER
        $query->whereHas('user', function ($query) use ($cmoAssets) {
            User::filterByCmoAssets($query, $cmoAssets);
        });
        return $query;
    }
}
