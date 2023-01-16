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

    public function scopeOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        if (empty($operationalRequirements)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($operationalRequirements) {
            User::scopeOperationalRequirements($query, $operationalRequirements);
        });

        return $query;
    }
    public function scopeLocationPreferences(Builder $query, ?array $workRegions): Builder
    {
        if (empty($workRegions)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($workRegions) {
            User::scopeLocationPreferences($query, $workRegions);
        });

        return $query;
    }
    public function scopeLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        if (empty($languageAbility)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($languageAbility) {
            User::scopeLanguageAbility($query, $languageAbility);
        });

        return $query;
    }
    public static function scopeAvailableInPools(Builder $query, ?array $poolIds): Builder
    {
        if (empty($poolIds)) {
            return $query;
        }

        $query->whereIn('pool_id', $poolIds);
        return $query;
    }

    public function scopeEquity(Builder $query, ?array $equity): Builder
    {
        if (empty($equity)) {
            return $query;
        }

        // mirroring the logic of scopeClassifications to access a pivot thru USER
        $query->whereHas('user', function ($query) use ($equity) {
            User::scopeEquity($query, $equity);
        });

        return $query;
    }

    public function scopeGeneralSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        // mirroring the logic of scopeClassifications to access a pivot thru USER
        $query->whereHas('user', function ($query) use ($search) {
            User::scopeGeneralSearch($query, $search);
        });

        return $query;
    }

    public static function scopeName(Builder $query, ?string $name): Builder
    {
        if (empty($name)) {
            return $query;
        }

        // mirroring the logic of scopeClassifications to access a pivot thru USER
        $query->whereHas('user', function ($query) use ($name) {
            User::scopeName($query, $name);
        });

        return $query;
    }

    public static function scopeEmail(Builder $query, ?string $email): Builder
    {
        if (empty($email)) {
            return $query;
        }

        // mirroring the logic of scopeClassifications to access a pivot thru USER
        $query->whereHas('user', function ($query) use ($email) {
            User::scopeEmail($query, $email);
        });

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
        if (empty($hasDiploma)) {
            return $query;
        }

        // mirroring the logic of scopeClassifications to access a pivot thru USER
        $query->whereHas('user', function ($query) use ($hasDiploma) {
            User::scopeHasDiploma($query, $hasDiploma);
        });
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

    public static function scopePositionDuration(Builder $query, ?array $positionDuration) : Builder
    {

        if (empty($positionDuration)) {
            return $query;
        }

        // call the positionDurationFilter off connected user
        $query->whereHas('user', function (Builder $userQuery) use ($positionDuration) {
            User::scopePositionDuration($userQuery, $positionDuration);
        });

        return $query;
    }

    public function scopeSkills(Builder $query, ?array $skills): Builder
    {
        if (empty($skills)) {
            return $query;
        }

        // call the skillFilter off connected user
        $query->whereHas('user', function (Builder $userQuery) use ($skills) {
            User::scopeSkills($userQuery, $skills);
        });

        return $query;
    }

    /**
     * Restrict the query to users who are either Actively Looking for or Open to opportunities.
     *
     * @param Builder $query
     * @return Builder
     */
    public static function scopeAvailableForOpportunities(Builder $query): Builder
    {

        $query->whereHas('user', function (Builder $userQuery) {
            User::scopeAvailableForOpportunities($userQuery);
        });
        return $query;
    }
}
