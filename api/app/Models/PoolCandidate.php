<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Str;

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
 * @property Illuminate\Support\Carbon $suspended_at
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property array $submitted_steps
 * @property string $education_requirement_option
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
        'suspended_at' => 'datetime',
        'profile_snapshot' => 'json',
        'submitted_steps' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'archived_at',
        'submitted_at',
        'suspended_at',
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
    public function screeningQuestionResponses(): HasMany
    {
        return $this->hasMany(ScreeningQuestionResponse::class);
    }

    // education_requirement_option fulfilled by what experience models
    public function educationRequirementAwardExperiences(): BelongsToMany
    {
        return $this->morphedByMany(
            AwardExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }
    public function educationRequirementCommunityExperiences(): BelongsToMany
    {
        return $this->morphedByMany(
            CommunityExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }
    public function educationRequirementEducationExperiences(): BelongsToMany
    {
        return $this->morphedByMany(
            EducationExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }
    public function educationRequirementPersonalExperiences(): BelongsToMany
    {
        return $this->morphedByMany(
            PersonalExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }
    public function educationRequirementWorkExperiences(): BelongsToMany
    {
        return $this->morphedByMany(
            WorkExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }
    public function getEducationRequirementExperiencesAttribute()
    {
        $collection = collect();
        $collection = $collection->merge($this->educationRequirementAwardExperiences);
        $collection = $collection->merge($this->educationRequirementCommunityExperiences);
        $collection = $collection->merge($this->educationRequirementEducationExperiences);
        $collection = $collection->merge($this->educationRequirementPersonalExperiences);
        $collection = $collection->merge($this->educationRequirementWorkExperiences);
        return $collection;
    }

    public static function scopeQualifiedStreams(Builder $query, ?array $streams): Builder
    {
        if (empty($streams)) {
            return $query;
        }

        // Ensure the PoolCandidates are qualified and available.
        $query->where(function ($query) {
            $query->whereDate('pool_candidates.expiry_date', '>=', Carbon::now())->orWhereNull('expiry_date'); // Where the PoolCandidate is not expired
        })
            ->whereIn('pool_candidates.pool_candidate_status', [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL]) // Where the PoolCandidate is accepted into the pool and not already placed.
            ->where(function ($query) {
                $query->whereDate('suspended_at', '>=', Carbon::now())->orWhereNull('suspended_at'); // Where the candidate has not suspended their candidacy in the pool
            })
            // Now scope for valid pools, according to streams
            ->whereHas('pool', function ($query) use ($streams) {
                $query->whereIn('stream', $streams);
            });
        return $query;
    }

    /**
     * Scopes the query to only return PoolCandidates who are available in a pool with one of the specified classifications.
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

        // Ensure the PoolCandidates are qualified and available.
        $query->where(function ($query) {
            $query->whereDate('pool_candidates.expiry_date', '>=', Carbon::now())->orWhereNull('expiry_date'); // Where the PoolCandidate is not expired
        })
            ->whereIn('pool_candidates.pool_candidate_status', [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL]) // Where the PoolCandidate is accepted into the pool and not already placed.
            ->where(function ($query) {
                $query->whereDate('suspended_at', '>=', Carbon::now())->orWhereNull('suspended_at'); // Where the candidate has not suspended their candidacy in the pool
            })
            // Now ensure the PoolCandidate is in a pool with the right classification
            ->whereHas('pool', function ($query) use ($classifications) {
                $query->whereHas('classifications', function ($query) use ($classifications) {
                    $query->where(function ($query) use ($classifications) {
                        foreach ($classifications as $classification) {
                            $query->orWhere(function ($query) use ($classification) {
                                $query->where('group', $classification['group'])->where('level', $classification['level']);
                            });
                        }
                    });
                });
            });

        return $query;
    }

    /**
     * scopeExpectedClassifications
     *
     * Scopes the query to only include applicants who have expressed interest in any of $classifications.
     *
     * @param Builder $query
     * @param array|null $classifications
     * @return Builder
     */
    public function scopeExpectedClassifications(Builder $query, ?array $classifications): Builder
    {
        // if no filters provided then return query unchanged
        if (empty($classifications)) {
            return $query;
        }

        // pointing to the classification scope on the User model
        // that scope also contains filterByClassificationToSalary and filterByClassificationToGenericJobTitles
        $query->whereHas('user', function ($query) use ($classifications) {
            User::scopeExpectedClassifications($query, $classifications);
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
        $query->whereIn('pool_candidate_status', [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL])
            ->where(function ($query) {
                $query->whereDate('suspended_at', '>=', Carbon::now())
                    ->orWhereNull('suspended_at');
            });
        return $query;
    }

    public function scopeHasDiploma(Builder $query, ?bool $hasDiploma): Builder
    {
        if (empty($hasDiploma)) {
            return $query;
        }

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

    // to replace scopeExpiryFilter which is entangled in deprecated queries
    public static function scopeExpiryStatus(Builder $query, ?string $expiryStatus)
    {
        $expiryStatus = isset($expiryStatus) ? $expiryStatus : ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE;
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

    public static function scopeSuspendedStatus(Builder $query, ?string $suspendedStatus)
    {
        $suspendedStatus = isset($suspendedStatus) ? $suspendedStatus : ApiEnums::CANDIDATE_SUSPENDED_FILTER_ACTIVE;
        if ($suspendedStatus == ApiEnums::CANDIDATE_SUSPENDED_FILTER_ACTIVE) {
            $query->where(function ($query) {
                $query->whereDate('suspended_at', '>=', Carbon::now())
                    ->orWhereNull('suspended_at');
            });
        } else if ($suspendedStatus == ApiEnums::CANDIDATE_SUSPENDED_FILTER_SUSPENDED) {
            $query->whereDate('suspended_at', '<', Carbon::now());
        }
        return $query;
    }

    public function scopeNotDraft(Builder $query): Builder
    {

        $query->whereNotNull("submitted_at")
            ->where('submitted_at', '<=', now());

        return $query;
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
            'workExperiences',
            'poolCandidates.screeningQuestionResponses',
            'poolCandidates.screeningQuestionResponses.screeningQuestion',
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

    public static function scopePositionDuration(Builder $query, ?array $positionDuration): Builder
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

    public function scopeSkillsAdditive(Builder $query, ?array $skills): Builder
    {

        if (empty($skills)) {
            return $query;
        }

        $query = $this->addSkillCountSelect($query, $skills);

        // call the skillFilter off connected user
        $query->whereHas('user', function (Builder $userQuery) use ($skills) {
            User::scopeSkillsAdditive($userQuery, $skills);
        });

        return $query;
    }

    public function scopeSkillsIntersectional(Builder $query, ?array $skills): Builder
    {
        if (empty($skills)) {
            return $query;
        }

        $query = $this->addSkillCountSelect($query, $skills);

        // call the skillFilter off connected user
        $query->whereHas('user', function (Builder $userQuery) use ($skills) {
            User::scopeSkillsIntersectional($userQuery, $skills);
        });

        return $query;
    }

    /**
     * Determine if a PoolCandidate is in draft mode
     *
     * @return bool
     */
    public function isDraft()
    {
        return is_null($this->submitted_at) || $this->submitted_at->isFuture();
    }

    /**
     * Scope the query to PoolCandidate's the current user can view
     */
    public function scopeAuthorizedToView(Builder $query)
    {
        $userId = Auth::user()->id;
        $user = User::find($userId);
        if (!$user->isAbleTo("view-any-application")) {
            $query->where(function (Builder $query) use ($user) {
                if ($user->isAbleTo("view-any-submittedApplication")) {
                    $query->orWhere('submitted_at', '<=', Carbon::now()->toDateTimeString());
                }

                if ($user->isAbleTo("view-team-submittedApplication")) {
                    $teamIds = $user->rolesTeams()->get()->pluck('id');
                    $query->orWhereHas('pool', function (Builder $query) use ($teamIds) {
                        return $query->whereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                }

                if ($user->isAbleTo("view-own-application")) {
                    $query->orWhere('user_id', $user->id);
                }
            });
        }

        return $query;
    }

    /**
     * Take the new application step to insert and add it to the array, preserving uniqueness
     */
    public function setInsertSubmittedStepAttribute($applicationStep)
    {
        $submittedSteps = collect([$this->submitted_steps, $applicationStep])->flatten()->unique();

        $this->submitted_steps = $submittedSteps->values()->all();
    }

    public function scopeWithSkillCount(Builder $query)
    {
        // Checks if the query already has a skill_count select and if it does, it skips adding it again
        $columns = $query->getQuery()->columns;
        $normalizedColumns = array_map(function ($column) {
            // Massage the column name to be a string and only return the column name
            return $column instanceof Expression
                ? Str::afterLast($column->getValue(DB::getQueryGrammar()), 'as ')
                : Str::afterLast($column, 'as ');
        }, $columns ?? []);

        // Check if our array of columns contains the skill_count column
        // If it does, we do not need to add it again
        if (in_array('"skill_count"', $normalizedColumns)) {
            return $query;
        }

        return $query->addSelect([
            "skill_count" =>  Skill::whereIn('skills.id', [])
                ->select(DB::raw('null as skill_count'))
        ]);
    }

    private function addSkillCountSelect(Builder $query, ?array $skills): Builder
    {
        return $query->addSelect([
            'skill_count' => Skill::whereIn('skills.id', $skills)
                ->join('users', 'users.id', '=', 'pool_candidates.user_id')
                ->select(DB::raw('count(*) as skills'))
                ->where(function (Builder $query) {
                    $query->orWhereHas('awardExperiences', function (Builder $query) {
                        $query->whereColumn('user_id', 'users.id');
                    })
                        ->orWhereHas('educationExperiences', function (Builder $query) {
                            $query->whereColumn('user_id', 'users.id');
                        })
                        ->orWhereHas('communityExperiences', function (Builder $query) {
                            $query->whereColumn('user_id', 'users.id');
                        })
                        ->orWhereHas('personalExperiences', function (Builder $query) {
                            $query->whereColumn('user_id', 'users.id');
                        })
                        ->orWhereHas('workExperiences', function (Builder $query) {
                            $query->whereColumn('user_id', 'users.id');
                        });
                })

        ]);
    }
}
