<?php

namespace App\Models;

use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\FinalDecision;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\PriorityWeight;
use App\Enums\PublishingGroup;
use App\Enums\SkillCategory;
use App\Observers\PoolCandidateObserver;
use App\ValueObjects\ProfileSnapshot;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class PoolCandidate
 *
 * @property string $id
 * @property ?\Illuminate\Support\Carbon $expiry_date
 * @property ?\Illuminate\Support\Carbon $archived_at
 * @property ?\Illuminate\Support\Carbon $submitted_at
 * @property ?string $signature
 * @property ?string $pool_candidate_status
 * @property ?int $status_weight
 * @property string $pool_id
 * @property string $user_id
 * @property ?\Illuminate\Support\Carbon $suspended_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property array $submitted_steps
 * @property ?string $education_requirement_option
 * @property ?bool $is_bookmarked
 * @property ?\Illuminate\Support\Carbon $placed_at
 * @property ?string $placed_department_id
 * @property ?\Illuminate\Support\Carbon $final_decision_at
 * @property ?\Illuminate\Support\Carbon $removed_at
 * @property ?string $removal_reason
 * @property ?string $removal_reason_other
 * @property ?string $veteran_verification
 * @property ?\Illuminate\Support\Carbon $veteran_verification_expiry
 * @property ?string $priority_verification
 * @property ?\Illuminate\Support\Carbon $priority_verification_expiry
 * @property array $computed_assessment_status
 * @property ?int $computed_final_decision_weight
 * @property ?string $computed_final_decision
 * @property array<string, mixed> $profile_snapshot
 */
class PoolCandidate extends Model
{
    use HasFactory;
    use LogsActivity;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'expiry_date' => 'date',
        'archived_at' => 'datetime',
        'submitted_at' => 'datetime',
        'suspended_at' => 'datetime',
        'profile_snapshot' => ProfileSnapshot::class,
        'submitted_steps' => 'array',
        'is_bookmarked' => 'boolean',
        'placed_at' => 'datetime',
        'final_decision_at' => 'datetime',
        'removed_at' => 'datetime',
        'veteran_verification_expiry' => 'date',
        'priority_verification_expiry' => 'date',
        'computed_assessment_status' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'archived_at',
        'submitted_at',
        'suspended_at',
        'removed_at',
        'final_decision_at',
        'placed_at',
        'user_id',
        'pool_id',
        'signature',
        'profile_snapshot',
        'expiry_date',
        'pool_candidate_status',
        'submitted_steps',
        'education_requirement_option',
        'veteran_verification',
        'veteran_verification_expiry',
        'priority_verification',
        'priority_verification_expiry',
        'is_bookmarked',
    ];

    protected $touches = ['user'];

    /**
     * The model's default values for attributes.
     */
    protected $attributes = [
        'is_bookmarked' => false,
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        PoolCandidate::observe(PoolCandidateObserver::class);
    }

    public static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            // Check if the 'notes' attribute is being updated and if so, update the searchable user model
            // Seems to work without this but not sure why
            if ($model->user()->exists() && $model->isDirty('notes')) {
                $model->user()->searchable();
            }
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class)->select(Pool::getSelectableColumns())->withTrashed();
    }

    /** @return BelongsTo<Department, $this> */
    public function placedDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** @return HasMany<GeneralQuestionResponse, $this> */
    public function generalQuestionResponses(): HasMany
    {
        return $this->hasMany(GeneralQuestionResponse::class)->select([
            'id',
            'pool_candidate_id',
            'general_question_id',
            'answer',
        ]);
    }

    /** @return HasMany<ScreeningQuestionResponse, $this> */
    public function screeningQuestionResponses(): HasMany
    {
        return $this->hasMany(ScreeningQuestionResponse::class);
    }

    /** @return BelongsToMany<AwardExperience, $this> */
    public function educationRequirementAwardExperiences(): BelongsToMany
    {
        return $this->belongsToMany(
            AwardExperience::class,
            'pool_candidate_education_requirement_experience',
            'pool_candidate_id',
            'experience_id'
        )
            ->withTimestamps();
    }

    /** @return BelongsToMany<CommunityExperience, $this> */
    public function educationRequirementCommunityExperiences(): BelongsToMany
    {
        return $this->belongsToMany(
            CommunityExperience::class,
            'pool_candidate_education_requirement_experience',
            'pool_candidate_id',
            'experience_id'
        )
            ->withTimestamps();
    }

    /** @return BelongsToMany<EducationExperience, $this> */
    public function educationRequirementEducationExperiences(): BelongsToMany
    {
        return $this->belongsToMany(
            EducationExperience::class,
            'pool_candidate_education_requirement_experience',
            'pool_candidate_id',
            'experience_id'
        )
            ->withTimestamps();
    }

    /** @return BelongsToMany<PersonalExperience, $this> */
    public function educationRequirementPersonalExperiences(): BelongsToMany
    {
        return $this->belongsToMany(
            PersonalExperience::class,
            'pool_candidate_education_requirement_experience',
            'pool_candidate_id',
            'experience_id'
        )
            ->withTimestamps();
    }

    /** @return BelongsToMany<WorkExperience, $this> */
    public function educationRequirementWorkExperiences(): BelongsToMany
    {
        return $this->belongsToMany(
            WorkExperience::class,
            'pool_candidate_education_requirement_experience',
            'pool_candidate_id',
            'experience_id'
        )
            ->withTimestamps();
    }

    /** @return HasMany<AssessmentResult, $this> */
    public function assessmentResults(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    /** @return BelongsToMany<Experience, $this> */
    public function educationRequirementExperiences(): BelongsToMany
    {
        return $this->belongsToMany(
            Experience::class,
            'pool_candidate_education_requirement_experience',
            'pool_candidate_id',
            'experience_id'
        )
            ->withTimestamps();
    }

    public function getCategoryAttribute()
    {
        $category = PriorityWeight::OTHER;

        $this->loadMissing(['user' => [
            'citizenship',
            'priority_weight',
            'armed_forces_status',
        ]]);

        if ($this->user->has_priority_entitlement && $this->priority_verification !== ClaimVerificationResult::REJECTED->name) {
            $category = PriorityWeight::PRIORITY_ENTITLEMENT;
        } elseif ($this->user->armed_forces_status == ArmedForcesStatus::VETERAN->name && $this->veteran_verification !== ClaimVerificationResult::REJECTED->name) {
            $category = PriorityWeight::VETERAN;
        } elseif ($this->user->citizenship === CitizenshipStatus::CITIZEN->name || $this->user->citizenship === CitizenshipStatus::PERMANENT_RESIDENT->name) {
            $category = PriorityWeight::CITIZEN_OR_PERMANENT_RESIDENT;
        }

        return [
            'weight' => $category->weight($category->name),
            'value' => $category->name,
            'label' => PriorityWeight::localizedString($category->name),
        ];
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
            ->whereIn('pool_candidates.pool_candidate_status', PoolCandidateStatus::qualifiedEquivalentGroup()) // Where the PoolCandidate is accepted into the pool and not already placed.
            ->where(function ($query) {
                $query->where('suspended_at', '>=', Carbon::now())->orWhereNull('suspended_at'); // Where the candidate has not suspended their candidacy in the pool
            })
            // Now scope for valid pools, according to streams
            ->whereHas('pool', function ($query) use ($streams) {
                $query->whereWorkStreamsIn($streams);
            });

        return $query;
    }

    /**
     * Scopes the query to return PoolCandidates in a specified community via the relation chain candidate->pool->community
     */
    public static function scopeCandidatesInCommunity(Builder $query, ?string $communityId): Builder
    {
        if (empty($communityId)) {
            return $query;
        }

        $query->whereHas('pool', function ($query) use ($communityId) {
            $query->where('community_id', $communityId);
        });

        return $query;
    }

    /**
     * Scopes the query to return PoolCandidates in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public static function scopeAppliedClassifications(Builder $query, ?array $classifications): Builder
    {
        if (empty($classifications)) {
            return $query;
        }

        $query->whereHas('pool', function ($query) use ($classifications) {
            $query->whereClassifications($classifications);
        });

        return $query;
    }

    /**
     * Scopes the query to only return PoolCandidates who are available in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public static function scopeQualifiedClassifications(Builder $query, ?array $classifications): Builder
    {
        if (empty($classifications)) {
            return $query;
        }

        // Ensure the PoolCandidates are qualified and available.
        $query = self::scopeAvailable($query);

        // Now ensure the PoolCandidate is in a pool with the right classification
        $query = self::scopeAppliedClassifications($query, $classifications);

        return $query;
    }

    /**
     * Scope Publishing Groups
     *
     * Restrict a query by specific publishing groups
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query  The existing query being built
     * @param  ?array  $publishingGroups  The publishing groups to scope the query by
     * @return \Illuminate\Database\Eloquent\Builder The resulting query
     */
    public static function scopePublishingGroups(Builder $query, ?array $publishingGroups)
    {
        // Early return if no publishing groups were supplied
        if (empty($publishingGroups)) {
            return $query;
        }

        $query = $query->whereHas('pool', function (Builder $query) use ($publishingGroups) {
            /** @var \App\Builders\PoolBuilder $query */
            $query->publishingGroups($publishingGroups);
        });

        return $query;
    }

    /**
     * Scope is IT & OTHER Publishing Groups
     *
     * Restrict a query by pool candidates that are for pools
     * containing IT and OTHER publishing groups
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query  The existing query being built
     * @return \Illuminate\Database\Eloquent\Builder The resulting query
     */
    public static function scopeInTalentSearchablePublishingGroup(Builder $query)
    {
        $query = self::scopePublishingGroups($query, [
            PublishingGroup::IT_JOBS->name,
            PublishingGroup::OTHER->name,
        ]);

        return $query;
    }

    public function scopeOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        if (empty($operationalRequirements)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($operationalRequirements) {
            $query->whereOperationalRequirementsIn($operationalRequirements);
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
            $query->whereLocationPreferencesIn($workRegions);
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
            $query->whereLanguageAbility($languageAbility);
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
            $query->whereEquityIn($equity);
        });

        return $query;
    }

    public function scopeGeneralSearch(Builder $query, ?string $searchTerm): Builder
    {
        if (empty($searchTerm)) {
            return $query;
        }

        $query->whereHas('user', function ($userQuery) use ($searchTerm) {
            $userQuery->whereGeneralSearch($searchTerm);
        });

        return $query;
    }

    public static function scopeName(Builder $query, ?string $name): Builder
    {
        if (empty($name)) {
            return $query;
        }

        $query->whereHas('user', function ($query) use ($name) {
            $query->whereName($name);
        });

        return $query;
    }

    public static function scopeEmail(Builder $query, ?string $email): Builder
    {
        if (empty($email)) {
            return $query;
        }

        $query->whereHas('user', function ($query) use ($email) {
            $query->whereEmail($email);
        });

        return $query;
    }

    public static function scopeIsGovEmployee(Builder $query, ?bool $isGovEmployee): Builder
    {
        if ($isGovEmployee) {
            $query->whereHas('user', function ($query) {
                $query->whereIsGovEmployee(true);
            });
        }

        return $query;
    }

    public static function scopeNotes(Builder $query, ?string $notes): Builder
    {

        if (! empty($notes)) {
            $query->where('notes', 'ilike', "%{$notes}%");
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
        $query->whereIn('pool_candidate_status', PoolCandidateStatus::qualifiedEquivalentGroup())
            ->where(function ($query) {
                $query->where('suspended_at', '>=', Carbon::now())
                    ->orWhereNull('suspended_at');
            })
            ->where(function ($query) {
                self::scopeExpiryStatus($query, CandidateExpiryFilter::ACTIVE->name);
            });

        return $query;
    }

    public function scopeHasDiploma(Builder $query, ?bool $hasDiploma): Builder
    {
        if (empty($hasDiploma)) {
            return $query;
        }

        $query->whereHas('user', function ($query) use ($hasDiploma) {
            $query->whereHasDiploma($hasDiploma);
        });

        return $query;
    }

    public static function scopeExpiryStatus(Builder $query, ?string $expiryStatus)
    {
        $expiryStatus = isset($expiryStatus) ? $expiryStatus : CandidateExpiryFilter::ACTIVE->name;
        if ($expiryStatus == CandidateExpiryFilter::ACTIVE->name) {
            $query->where(function ($query) {
                $query->whereDate('expiry_date', '>=', date('Y-m-d'))
                    ->orWhereNull('expiry_date');
            });
        } elseif ($expiryStatus == CandidateExpiryFilter::EXPIRED->name) {
            $query->whereDate('expiry_date', '<', date('Y-m-d'));
        }

        return $query;
    }

    public static function scopeSuspendedStatus(Builder $query, ?string $suspendedStatus)
    {
        $suspendedStatus = isset($suspendedStatus) ? $suspendedStatus : CandidateSuspendedFilter::ACTIVE->name;
        if ($suspendedStatus == CandidateSuspendedFilter::ACTIVE->name) {
            $query->where(function ($query) {
                $query->where('suspended_at', '>=', Carbon::now())
                    ->orWhereNull('suspended_at');
            });
        } elseif ($suspendedStatus == CandidateSuspendedFilter::SUSPENDED->name) {
            $query->where('suspended_at', '<', Carbon::now());
        }

        return $query;
    }

    public function scopeNotDraft(Builder $query): Builder
    {

        $query->whereNotNull('submitted_at')
            ->where('submitted_at', '<=', now());

        return $query;
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
                            $query->where('priority_weight', PriorityWeight::weight($priorityWeight));
                        } else {
                            $query->orWhere('priority_weight', PriorityWeight::weight($priorityWeight));
                        }
                    }
                });
        });

        return $query;
    }

    public function scopeCandidateCategory(Builder $query, ?array $priorityWeights): Builder
    {
        if (empty($priorityWeights)) {
            return $query;
        }

        $query->whereExists(function ($query) use ($priorityWeights) {
            $query->selectRaw('null')
                ->from('users')
                ->whereColumn('users.id', 'pool_candidates.user_id')
                ->where(function ($query) use ($priorityWeights) {
                    foreach ($priorityWeights as $priorityWeight) {
                        switch ($priorityWeight) {
                            case PriorityWeight::PRIORITY_ENTITLEMENT->name:
                                $query->orWhereIn(
                                    'priority_verification',
                                    [ClaimVerificationResult::ACCEPTED->name, ClaimVerificationResult::UNVERIFIED->name]
                                );
                                break;

                            case PriorityWeight::VETERAN->name:
                                $query->orWhereIn(
                                    'veteran_verification',
                                    [ClaimVerificationResult::ACCEPTED->name, ClaimVerificationResult::UNVERIFIED->name]
                                );
                                break;

                            case PriorityWeight::CITIZEN_OR_PERMANENT_RESIDENT->name:
                                $query->orWhereIn(
                                    'citizenship',
                                    [CitizenshipStatus::CITIZEN->name, CitizenshipStatus::PERMANENT_RESIDENT->name]
                                );
                                break;

                            case PriorityWeight::OTHER->name:
                                $query->orWhere('citizenship', CitizenshipStatus::OTHER->name);
                                break;
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
        $query->whereHas('user', function ($userQuery) use ($positionDuration) {
            $userQuery->wherePositionDurationIn($positionDuration);
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
        $query->whereHas('user', function ($userQuery) use ($skills) {
            $userQuery->whereSkillsAdditive($skills);
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
        $query->whereHas('user', function ($query) use ($skills) {
            $query->whereSkillsIntersectional($skills);
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
    public function scopeAuthorizedToView(Builder $query, ?array $args = null): void
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        $now = Carbon::now()->toDateTimeString();

        // we might want to add some filters for some candidates
        $filterCountBefore = count($query->getQuery()->wheres);
        $query->where(function (Builder $query) use ($user, $now) {
            if ($user?->isAbleTo('view-any-submittedApplication')) {
                $query->orWhere('submitted_at', '<=', $now);
            }

            if ($user?->isAbleTo('view-team-submittedApplication')) {
                $allTeam = $user->rolesTeams()->get();
                $teamIds = $allTeam->filter(function ($team) use ($user) {
                    return $user->isAbleTo('view-team-submittedApplication', $team);
                })->pluck('id');

                $query->orWhere(function (Builder $query) use ($teamIds, $now) {
                    $query->where('submitted_at', '<=', $now)
                        ->whereHas('pool', function (Builder $query) use ($teamIds) {
                            return $query->where(function (Builder $query) use ($teamIds) {
                                $query->orWhereHas('legacyTeam', function (Builder $query) use ($teamIds) {
                                    return $query->whereIn('id', $teamIds);
                                })->orWhereHas('team', function (Builder $query) use ($teamIds) {
                                    return $query->whereIn('id', $teamIds);
                                })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                                    return $query->whereIn('id', $teamIds);
                                });
                            });
                        });
                });
            }

            if ($user?->isAbleTo('view-own-application')) {
                $query->orWhere('user_id', $user->id);
            }
        });
        $filterCountAfter = count($query->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return;
        }

        // fall through - query will return nothing
        $query->where('id', null);
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
            'skill_count' => Skill::whereIn('skills.id', [])
                ->select(DB::raw('null as skill_count')),
        ]);
    }

    private function addSkillCountSelect(Builder $query, ?array $skills): Builder
    {
        return $query->addSelect([
            'skill_count' => Skill::whereIn('skills.id', $skills)
                ->join('users', 'users.id', '=', 'pool_candidates.user_id')
                ->whereHas('userSkills', function (Builder $query) {
                    $query->whereColumn('user_id', 'users.id');
                })
                ->select(DB::raw('count(*) as skills')),
        ]);
    }

    /**
     * Custom sort to handle issues with how laravel aliases
     * aggregate selects and orderBys for json fields in `lighthouse-php`
     *
     * The column used in the orderBy is `table_aggregate_column->property`
     * But is actually aliased to snake case `table_aggregate_columnproperty`
     */
    public function scopeOrderByPoolName(Builder $query, ?array $args): Builder
    {
        extract($args);

        if (isset($order) && isset($locale)) {
            $query = $query->withMax('pool', 'name->'.$locale)->orderBy('pool_max_name'.$locale, $order);
        }

        return $query;
    }

    public function scopeOrderByClaimVerification(Builder $query, ?array $args)
    {

        if (isset($args['order'])) {

            $orderWithoutDirection = <<<'SQL'
                CASE
                    WHEN
                        (priority_verification = 'ACCEPTED' OR priority_verification = 'UNVERIFIED')
                    THEN
                        40
                    WHEN
                        (veteran_verification = 'ACCEPTED' OR veteran_verification = 'UNVERIFIED')
                        AND
                        (priority_verification IS NULL OR priority_verification = 'REJECTED')
                    THEN
                        30
                    WHEN
                        (users.citizenship = 'CITIZEN' OR users.citizenship = 'PERMANENT_RESIDENT')
                        AND
                        (
                            (priority_verification IS NULL OR priority_verification = 'REJECTED')
                            OR
                            (veteran_verification IS NULL OR veteran_verification = 'REJECTED')
                        )
                    THEN
                        20
                    ELSE
                        10
                    END
            SQL;

            $query
                ->join('users', 'users.id', '=', 'pool_candidates.user_id')
                ->select('users.citizenship', 'pool_candidates.*');

            if (isset($args['useBookmark']) && $args['useBookmark']) {
                $query->orderBy('is_bookmarked', 'DESC');
            }

            $order = sprintf('%s %s', $orderWithoutDirection, $args['order']);

            $query->orderByRaw($order)->orderBy('submitted_at', 'ASC');
        }

        return $query;
    }

    public function setApplicationSnapshot(bool $save = true)
    {
        $this->profile_snapshot = ['userId' => $this->user_id, 'poolId' => $this->pool_id];

        if ($save) {
            $this->save();
        }
    }

    /**
     * Determines a candidates current assessment status
     * based on the following logic:
     *
     *   foreach step in pool->assessmentSteps
     *       foreach skill in assessmentStep->skills:
     *           result = find matching assessment result
     *           if skill is essential:
     *               if result is UNSUCCESSFUL, THEN mark UNSUCCESSFUL and exit loop
     *               if result is HOLD THEN mark HOLD and continue loop (to look for failures)
     *               if result is null or undecided, THEN mark TO ASSESS and continue loop (to look for failures)
     *           else if skill is asset:
     *               if skill is Technical AND user did not claim skill, THEN skip and continue loop
     *               else if null or undecided THEN mark TO ASSESS and continue loop (to look for essential failures)
     *               else mark nothing and continue, since the result doesn't actually matter
     *       and if step is Application Assessment then repeat the Essential switch statement education assessment result
     *       stepStatus is first of UNSUCCESSFUL, TO ASSESS, HOLD, and else QUALIFIED
     *       no decision for steps that are TO ASSESS but have no results so we can tell when they've been started
     *
     *   overallAssessmentStatus is then:
     *      if any step is UNSUCCESSFUL, then DISQUALIFIED
     *      else if all steps are fully assessed, and final step is not HOLD, then QUALIFIED
     *      else TO ASSESS
     */
    public function computeAssessmentStatus()
    {
        $decisions = [];
        $currentStep = 1;
        $this->load([
            'pool.assessmentSteps',
            'pool.assessmentSteps.poolSkills',
            'pool.assessmentSteps.poolSkills.skill',
            'assessmentResults',
            'assessmentResults.poolSkill',
            'user.userSkills',
        ]);

        foreach ($this->pool->assessmentSteps as $index => $step) {
            $stepId = $step->id;
            $hasFailure = false;
            $hasOnHold = false;
            $hasToAssess = false;

            $isApplicationScreening = $step->type === AssessmentStepType::APPLICATION_SCREENING->name;
            $stepResults = $this->assessmentResults->where('assessment_step_id', $stepId);

            foreach ($step->poolSkills as $poolSkill) {
                $result = $stepResults->firstWhere('pool_skill_id', $poolSkill->id);
                $decision = $result?->assessment_decision;

                if ($poolSkill->type === PoolSkillType::ESSENTIAL->name) {
                    if (! $result || is_null($result->assessment_decision)) {
                        $hasToAssess = true;

                        continue;
                    }

                    // UNSUCCESSFUL on essential skills always takes precedence over other statuses, so we can exit the loop right away.
                    if ($decision === AssessmentDecision::UNSUCCESSFUL->name) {
                        $hasFailure = true;
                        break;
                    }

                    if ($decision === AssessmentDecision::HOLD->name) {
                        $hasOnHold = true;

                        continue;
                    }
                } else { // $poolSkill is an ASSET skill
                    // Asset behavioural skills never need to be assessed
                    if ($poolSkill->skill->category === SkillCategory::BEHAVIOURAL->name) {
                        continue;
                    }

                    // We do not need to evaluate non-essential technical skills that are not on
                    // the users snapshot, so skip the result check
                    $isClaimed = false;
                    $snapshot = $this->profile_snapshot;

                    if ($snapshot) {
                        $experiences = collect($snapshot['experiences']);

                        $isClaimed = $experiences->contains(function ($experience) use ($poolSkill) {
                            foreach ($experience['skills'] as $skill) {
                                if ($skill['id'] === $poolSkill->skill_id) {
                                    return true;
                                }
                            }

                            return false;
                        });
                    }

                    if (! $isClaimed) {
                        continue;
                    }

                    if (! $result || is_null($result->assessment_decision)) {
                        $hasToAssess = true;
                    }
                }
            }

            if ($isApplicationScreening) {
                $educationResults = $stepResults->where('assessment_result_type', AssessmentResultType::EDUCATION->name);

                // automatically to assess if education results null or empty
                if (! isset($educationResults) || count($educationResults) == 0) {
                    $hasToAssess = true;
                }

                foreach ($educationResults as $result) {
                    if (! $result || is_null($result->assessment_decision)) {
                        $hasToAssess = true;

                        continue;
                    }

                    $decision = $result->assessment_decision;

                    if ($decision === AssessmentDecision::UNSUCCESSFUL->name) {
                        $hasFailure = true;
                        break;
                    }

                    if ($decision === AssessmentDecision::HOLD->name) {
                        $hasOnHold = true;

                        continue;
                    }
                }
            }

            // We have results and essential skills exist so,
            // loop through them to determine success

            if ($hasFailure) {
                $decisions[] = [
                    'step' => $stepId,
                    'decision' => AssessmentDecision::UNSUCCESSFUL->name,
                ];

                continue;
            }

            if ($hasToAssess) {
                // Don't add the step if it has no results yet to allow differentiating between
                // not started and in progress steps
                if (! $stepResults->isEmpty()) {
                    $decisions[] = [
                        'step' => $stepId,
                        'decision' => null,
                    ];
                }

                continue;
            }

            // Candidate has been assessed and was not unsuccessful so continue to next step

            $previousStepsNotPassed = count($decisions) < $index || Arr::where($decisions, function ($decision) {
                return is_null($decision['decision']) ||
                    $decision['decision'] === AssessmentDecision::UNSUCCESSFUL->name;
            });

            if (! $previousStepsNotPassed) {
                $currentStep++;
            }

            if ($hasOnHold) {
                $decisions[] = [
                    'step' => $stepId,
                    'decision' => AssessmentDecision::HOLD->name,
                ];

                continue;
            }

            $decisions[] = [
                'step' => $stepId,
                'decision' => AssessmentDecision::SUCCESSFUL->name,
            ];
        }

        $totalSteps = $this->pool->assessmentSteps->count();
        $overallAssessmentStatus = OverallAssessmentStatus::TO_ASSESS->name;

        $unsuccessfulDecisions = Arr::where($decisions, function ($stepDecision) {
            return $stepDecision['decision'] === AssessmentDecision::UNSUCCESSFUL->name;
        });
        if (! empty($unsuccessfulDecisions)) {
            $overallAssessmentStatus = OverallAssessmentStatus::DISQUALIFIED->name;
        } elseif ($currentStep >= $totalSteps && $totalSteps === count($decisions)) {
            $lastStepDecision = end($decisions);
            if ($lastStepDecision && $lastStepDecision['decision'] !== AssessmentDecision::HOLD->name && ! is_null($lastStepDecision['decision'])) {
                $overallAssessmentStatus = OverallAssessmentStatus::QUALIFIED->name;
                $currentStep = null;
            }
        }

        // While unlikely, current step could go over.
        // So, set it back to total steps
        if ($currentStep && $currentStep > $totalSteps) {
            $currentStep = $totalSteps;
        }

        return [
            'currentStep' => $currentStep,
            'overallAssessmentStatus' => $overallAssessmentStatus,
            'assessmentStepStatuses' => $decisions,
        ];
    }

    public function scopeProcessNumber(Builder $query, ?string $processNumber): Builder
    {
        // Early return if no process number was supplied
        if (empty($processNumber)) {
            return $query;
        }

        $query = $query->whereHas('pool', function (Builder $query) use ($processNumber) {
            /** @var \App\Builders\PoolBuilder $query */
            $query->processNumber($processNumber);
        });

        return $query;
    }

    public function computeFinalDecision()
    {
        $this->load(['user']);

        $status = $this->pool_candidate_status;
        $decision = null;

        // Short circuit for a case which shouldn't really come up. A PoolCandidate should never go from non-draft back to draft, but just in case...
        if ($status === PoolCandidateStatus::DRAFT->name || $status === PoolCandidateStatus::DRAFT_EXPIRED->name) {
            return ['decision' => null, 'weight' => null];
        }

        if (in_array($status, PoolCandidateStatus::toAssessGroup())) {
            $assessmentStatus = $this->computed_assessment_status;
            $overallStatus = null;
            if (isset($assessmentStatus['overallAssessmentStatus'])) {
                $overallStatus = $assessmentStatus['overallAssessmentStatus'];
            }

            $decision = match ($overallStatus) {
                OverallAssessmentStatus::QUALIFIED->name => FinalDecision::QUALIFIED_PENDING->name,
                OverallAssessmentStatus::DISQUALIFIED->name => FinalDecision::DISQUALIFIED_PENDING->name,
                default => FinalDecision::TO_ASSESS->name
            };
        } else {

            $decision = match ($status) {

                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name => FinalDecision::DISQUALIFIED->name,

                PoolCandidateStatus::QUALIFIED_AVAILABLE->name => FinalDecision::QUALIFIED->name,

                PoolCandidateStatus::PLACED_CASUAL->name,
                PoolCandidateStatus::PLACED_INDETERMINATE->name,
                PoolCandidateStatus::PLACED_TENTATIVE->name,
                PoolCandidateStatus::PLACED_TERM->name => FinalDecision::QUALIFIED_PLACED->name,

                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name => FinalDecision::TO_ASSESS_REMOVED->name,

                PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name => FinalDecision::QUALIFIED_REMOVED->name,

                PoolCandidateStatus::REMOVED->name => FinalDecision::REMOVED->name,
                PoolCandidateStatus::EXPIRED->name => FinalDecision::QUALIFIED_EXPIRED->name,

                default => null
            };
        }

        $weight = match ($decision) {
            FinalDecision::QUALIFIED->name => 10,
            FinalDecision::QUALIFIED_PENDING->name => 20,
            FinalDecision::QUALIFIED_PLACED->name => 30,
            FinalDecision::TO_ASSESS->name => 40,
            // Set aside some values for assessment steps
            // Giving a decent buffer to increase max steps
            FinalDecision::DISQUALIFIED_PENDING->name => 200,
            FinalDecision::DISQUALIFIED->name => 210,
            FinalDecision::QUALIFIED_REMOVED->name => 220,
            FinalDecision::TO_ASSESS_REMOVED->name => 230,
            FinalDecision::DISQUALIFIED_REMOVED->name => 235, // I don't think this can be reached right now.
            FinalDecision::REMOVED->name => 240,
            FinalDecision::QUALIFIED_EXPIRED->name => 250,
            default => $this->unMatchedDecision($decision)
        };

        $assessmentStatus = $this->computed_assessment_status;
        $currentStep = null;
        if (isset($assessmentStatus)) {
            $currentStep = $assessmentStatus['currentStep'];
        }

        if ($decision === FinalDecision::TO_ASSESS->name && $currentStep) {
            $weight = $weight + $currentStep * 10;
        }

        return [
            'decision' => $decision,
            'weight' => $weight,
        ];
    }

    private function unMatchedDecision(?string $decision)
    {
        Log::error(sprintf('No match for decision %s', $decision));

        return null;
    }
}
