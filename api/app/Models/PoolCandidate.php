<?php

namespace App\Models;

use App\Builders\PoolCandidateBuilder;
use App\Enums\ActivityEvent;
use App\Enums\ApplicationStatus;
use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\CandidateInterest;
use App\Enums\CandidateRemovalReason;
use App\Enums\CandidateStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\ErrorCode;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\PriorityWeight;
use App\Enums\ScreeningStage;
use App\Enums\SkillCategory;
use App\Observers\PoolCandidateObserver;
use App\Traits\EnrichedNotifiable;
use App\ValueObjects\ProfileSnapshot;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
 * @property ?string $application_status
 * @property ?int $status_weight
 * @property string $pool_id
 * @property string $user_id
 * @property ?\Illuminate\Support\Carbon $suspended_at
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property array $submitted_steps
 * @property ?string $education_requirement_option
 * @property ?bool $is_flagged
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
 * @property array $flexible_work_locations
 * @property array<string> $education_requirement_experience_ids
 * @property ?string $assessment_step_id
 * @property ?string $screening_stage
 * @property ?string $disqualification_reason
 * @property ?string $placement_type
 * @property ?\Illuminate\Support\Carbon $disqualified_at
 * @property ?\Illuminate\Support\Carbon $qualified_at
 * @property bool $is_expired
 * @property bool $is_suspended
 * @property bool $is_open_to_jobs
 * @property bool $is_hired
 * @property bool $referring
 */
class PoolCandidate extends Model
{
    use EnrichedNotifiable;
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
        'is_flagged' => 'boolean',
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
        'application_status',
        'submitted_steps',
        'education_requirement_option',
        'veteran_verification',
        'veteran_verification_expiry',
        'priority_verification',
        'priority_verification_expiry',
        'is_flagged',
        'screening_stage',
        'assessment_step_id',
    ];

    protected $touches = ['user'];

    /**
     * The model's default values for attributes.
     */
    protected $attributes = [
        'is_flagged' => false,
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

    /*
     * Binds the eloquent builder to the model to allow for
     * applying scopes directly to Pool query builders
     *
     * i.e PoolCandidate::query()->whereName();
     */
    public function newEloquentBuilder($query): Builder
    {
        return new PoolCandidateBuilder($query);
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
        return $this->belongsTo(Pool::class)->withTrashed();
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

    /** @return MorphToMany<AwardExperience, $this> */
    public function educationRequirementAwardExperiences(): MorphToMany
    {
        return $this->morphedByMany(
            AwardExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }

    /** @return MorphToMany<CommunityExperience, $this> */
    public function educationRequirementCommunityExperiences(): MorphToMany
    {
        return $this->morphedByMany(
            CommunityExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }

    /** @return MorphToMany<EducationExperience, $this> */
    public function educationRequirementEducationExperiences(): MorphToMany
    {
        return $this->morphedByMany(
            EducationExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }

    /** @return MorphToMany<PersonalExperience, $this> */
    public function educationRequirementPersonalExperiences(): MorphToMany
    {
        return $this->morphedByMany(
            PersonalExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }

    /** @return MorphToMany<WorkExperience, $this> */
    public function educationRequirementWorkExperiences(): MorphToMany
    {
        return $this->morphedByMany(
            WorkExperience::class,
            'experience',
            'pool_candidate_education_requirement_experience'
        )
            ->withTimestamps();
    }

    /** @return HasMany<AssessmentResult, $this> */
    public function assessmentResults(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    /**
     * Get the assessment step that this candidate is currently on within a specific assessment plan.
     *
     * This relationship links the candidate's progress to a particular step in a multi-step assessment plan,
     * allowing for tracking and retrieval of the candidate's current position within the plan.
     *
     * @return BelongsTo<AssessmentStep, $this>
     * */
    public function assessmentStep(): BelongsTo
    {
        return $this->belongsTo(AssessmentStep::class);
    }

    // Primary use is factory seeding
    /** @return BelongsToMany<User, $this> */
    public function bookmarkedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pool_candidate_user_bookmarks', 'pool_candidate_id', 'user_id')
            ->withTimestamps();
    }

    /** @return Collection<string|int, Experience> */
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

    public function getCategoryAttribute()
    {
        $category = PriorityWeight::OTHER;

        $this->loadMissing(['user']);

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

    /**
     *  Array of education requirement experience IDs
     *
     *  This is used for referencing deleted experiences in the snapshot
     */
    public function educationRequirementExperienceIds(): Attribute
    {
        return Attribute::get(fn () => DB::table('pool_candidate_education_requirement_experience')
            ->where('pool_candidate_id', $this->id)
            ->pluck('experience_id')->all()
        );
    }

    /**
     * Candidate facing status
     *
     * Computation of different application meta data for a
     * candidate friendly version of their status
     */
    public function candidateStatus(): Attribute
    {
        return Attribute::get(function () {
            return match ($this->application_status) {
                ApplicationStatus::DRAFT->name => $this->is_expired ? CandidateStatus::EXPIRED->name : CandidateStatus::DRAFT->name,
                ApplicationStatus::DISQUALIFIED->name => CandidateStatus::UNSUCCESSFUL->name,
                ApplicationStatus::REMOVED->name => function () {
                    return match ($this->removal_reason) {
                        CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name => CandidateStatus::WITHDREW->name,
                        CandidateRemovalReason::NOT_RESPONSIVE->name => CandidateStatus::NOT_RESPONSIVE->name,
                        CandidateRemovalReason::INELIGIBLE->name => CandidateStatus::INELIGIBLE->name,
                        CandidateRemovalReason::OTHER->name => CandidateStatus::REMOVED->name,
                        default => CandidateStatus::REMOVED->name,
                    };
                },
                ApplicationStatus::QUALIFIED->name => CandidateStatus::QUALIFIED->name,
                ApplicationStatus::TO_ASSESS->name => function () {
                    return match ($this->screening_stage) {
                        ScreeningStage::NEW_APPLICATION->name => CandidateStatus::RECEIVED->name,
                        ScreeningStage::APPLICATION_REVIEW->name => CandidateStatus::UNDER_REVIEW->name,
                        ScreeningStage::SCREENED_IN->name => CandidateStatus::APPLICATION_REVIEWED->name,
                        ScreeningStage::UNDER_ASSESSMENT->name => CandidateStatus::UNDER_ASSESSMENT->name,
                        // Could not determine status, all other checks failed
                        default => null,
                    };
                },
                default => null
            };
        });
    }

    /**
     * Candidate interest
     *
     * Computation of a candidates interest in a process after being qualified
     *
     *  TO DO: Fix up the references to final_decision in #14389
     */
    public function candidateInterest(): Attribute
    {
        return Attribute::get(function () {
            return match (true) {
                $this->is_expired => CandidateInterest::EXPIRED->name,
                $this->is_suspended => CandidateInterest::NOT_INTERESTED->name,
                $this->is_open_to_jobs => CandidateInterest::OPEN_TO_JOBS->name,
                $this->is_hired => CandidateInterest::HIRED->name, // TODO: Will be removed eventually
                default => null,
            };
        });
    }

    /*
    * Determine if the candidate has withdrew
    *
    * @return bool
    */
    public function isSuspended(): Attribute
    {
        return Attribute::get(function () {
            return ($this->suspended_at && $this->suspended_at->isPast()) ||
                (! is_null($this->removal_reason) && in_array($this->removal_reason, [CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name, CandidateRemovalReason::NOT_RESPONSIVE->name]));
        });
    }

    /*
    * Determine if the candidate is qualified and open to jobs
    *
    * @return bool
    */
    public function isOpenToJobs(): Attribute
    {
        return Attribute::get(function () {
            return (empty($this->placed_at) || $this->placed_at->isPast()) &&
            (empty($this->placement_type) || in_array($this->placement_type, PlacementType::openToJobsGroup()));
        });
    }

    /*
    * Determine if the candidate is qualified and hired
    *
    * @return bool
    */
    public function isHired(): Attribute
    {
        return Attribute::get(function () {
            return ($this->placed_at && $this->placed_at->isPast()) ||
                in_array($this->placement_type, PlacementType::hiredGroup());
        });
    }

    /*
    * Determine if the application has expired
    *
    * @return bool
    */
    public function isExpired(): Attribute
    {
        return Attribute::get(function () {
            return $this->expiry_date && $this->expiry_date->isPast();
        });
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
     * Take the new application step to insert and add it to the array, preserving uniqueness
     */
    public function setInsertSubmittedStepAttribute($applicationStep)
    {
        $submittedSteps = collect([$this->submitted_steps, $applicationStep])->flatten()->unique();

        $this->submitted_steps = $submittedSteps->values()->all();
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
     *               mark nothing and continue, since the result doesn't actually matter
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
        $this->load([
            'pool.assessmentSteps',
            'pool.assessmentSteps.poolSkills',
            'pool.assessmentSteps.poolSkills.skill',
            'assessmentResults',
            'assessmentResults.poolSkill',
            'assessmentResults.poolSkill.skill',
        ]);

        $steps = $this->pool->assessmentSteps;
        $currentStep = $steps->first()->id ?? null;
        foreach ($steps as $index => $step) {
            $stepId = $step->id;
            $hasFailure = false;
            $hasOnHold = false;
            $hasToAssess = false;

            $isApplicationScreening = $step->type === AssessmentStepType::APPLICATION_SCREENING->name;
            $stepResults = $this->assessmentResults->where('assessment_step_id', $stepId);

            foreach ($step->poolSkills as $poolSkill) {
                $result = $stepResults->firstWhere('pool_skill_id', $poolSkill->id);
                $decision = $result?->assessment_decision;

                if ($poolSkill->type === PoolSkillType::ESSENTIAL->name && ! ($isApplicationScreening && $poolSkill->skill->category === SkillCategory::BEHAVIOURAL->name)) {
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
                $nextStep = $steps[$index + 1] ?? null;
                if (! is_null($nextStep)) {
                    $currentStep = $nextStep->id;
                }
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
        } elseif ($totalSteps === count($decisions)) {
            $lastStepDecision = end($decisions);
            $arrayOfStepDecisions = array_map(function ($decision) {
                return $decision['decision'];
            }, $decisions);

            if (
                $lastStepDecision['decision'] !== AssessmentDecision::HOLD->name &&
                ! in_array(null, $arrayOfStepDecisions) &&
                ! in_array(AssessmentDecision::UNSUCCESSFUL->name, $arrayOfStepDecisions)
            ) {
                $overallAssessmentStatus = OverallAssessmentStatus::QUALIFIED->name;
                $currentStep = null;
            }
        }

        // override to set current step as NULL if removed_at OR final_decision_at are set
        if (! is_null($this->removed_at) || ! is_null($this->final_decision_at)) {
            $currentStep = null;
        }

        return [
            $currentStep,
            [
                'overallAssessmentStatus' => $overallAssessmentStatus,
                'assessmentStepStatuses' => $decisions,
            ],
        ];
    }

    public function submit(?string $signature)
    {
        $this->disableLogging();

        $this->signature = $signature;
        $this->submitted_at = Carbon::now();
        $this->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->setInsertSubmittedStepAttribute(ApplicationStep::REVIEW_AND_SUBMIT->name);

        // claim verification
        if ($this->user->armed_forces_status == ArmedForcesStatus::VETERAN->name) {
            $this->veteran_verification = ClaimVerificationResult::UNVERIFIED->name;
        }
        if ($this->user->has_priority_entitlement) {
            $this->priority_verification = ClaimVerificationResult::UNVERIFIED->name;
        }

        // need to save application before setting application snapshot since fields have yet to be saved to the database.
        $this->save();

        $this->setApplicationSnapshot(false);

        [$_, $assessmentStatus] = $this->computeAssessmentStatus();

        $this->computed_assessment_status = $assessmentStatus;
        $this->screening_stage = ScreeningStage::NEW_APPLICATION->name;
        $this->assessment_step_id = null;
        $this->computed_final_decision_weight = 40;

        $this->save();

        $this->logActivity(ActivityEvent::SUBMITTED, [
            'signature' => $signature,
        ]);
    }

    // mark the pool candidate as qualified
    public function qualify(Carbon $expiryDate)
    {
        $this->disableLogging();

        $this->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->application_status = ApplicationStatus::QUALIFIED->name;
        $this->expiry_date = $expiryDate;
        $this->qualified_at = Carbon::now();
        $this->final_decision_at = Carbon::now();

        $this->screening_stage = null;
        $this->assessment_step_id = null;

        $this->computed_final_decision_weight = 10;

        $this->save();

        $this->logActivity(ActivityEvent::QUALIFIED, [
            'expiry_date' => $expiryDate->format('Y-m-d H:i:s'),
        ]);
    }

    // mark the pool candidate as disqualified
    public function disqualify(string $reason)
    {
        $this->disableLogging();

        $this->pool_candidate_status = $reason;
        $this->application_status = ApplicationStatus::DISQUALIFIED->name;
        $this->disqualification_reason = $reason;
        $this->disqualified_at = Carbon::now();
        $this->final_decision_at = Carbon::now();

        $this->screening_stage = null;
        $this->assessment_step_id = null;

        $this->computed_final_decision_weight = 210;

        $this->save();

        $this->logActivity(ActivityEvent::DISQUALIFIED);
    }

    // mark the pool candidate as placed
    public function place(string $placementType, string $departmentId)
    {
        $this->disableLogging();

        $this->pool_candidate_status = $placementType;
        $this->placement_type = $placementType;
        $this->placed_at = Carbon::now();
        $this->placed_department_id = $departmentId;

        $this->screening_stage = null;
        $this->assessment_step_id = null;

        $this->computed_final_decision_weight = 30;

        $this->save();

        $this->logActivity(ActivityEvent::PLACED, [
            'placement_type' => $placementType,
            'placed_department_id' => $departmentId,
        ]);
    }

    public function remove(?string $reason, ?string $otherReason)
    {
        $this->disableLogging();

        if ($this->application_status === ApplicationStatus::DRAFT->name) {
            throw new Exception(ErrorCode::CANDIDATE_UNEXPECTED_STATUS->name);
        }

        if ($this->application_status === ApplicationStatus::REMOVED->name) {
            throw new Exception(ErrorCode::REMOVE_CANDIDATE_ALREADY_REMOVED->name);
        }

        if (! empty($this->placement_type)) {
            throw new Exception(ErrorCode::REMOVE_CANDIDATE_ALREADY_PLACED->name);
        }

        $this->removed_at = Carbon::now();
        $this->removal_reason = $reason;
        if ($reason === CandidateRemovalReason::OTHER->name) {
            $this->removal_reason_other = $otherReason;
        }

        $this->screening_stage = null;
        $this->assessment_step_id = null;

        $this->computed_final_decision_weight = 240;

        // Update the candidates status based on the current status
        // or throw an error if the candidate is already placed or removed
        switch ($this->pool_candidate_status) {
            case PoolCandidateStatus::SCREENED_OUT_APPLICATION->name:
            case PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name:
                $this->pool_candidate_status = PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name;
                break;
            case PoolCandidateStatus::QUALIFIED_AVAILABLE->name:
            case PoolCandidateStatus::EXPIRED->name:
                $this->pool_candidate_status = PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name;
                break;
            case PoolCandidateStatus::NEW_APPLICATION->name:
            case PoolCandidateStatus::APPLICATION_REVIEW->name:
            case PoolCandidateStatus::SCREENED_IN->name:
            case PoolCandidateStatus::UNDER_ASSESSMENT->name:
                $this->pool_candidate_status = PoolCandidateStatus::REMOVED->name;
                break;
            default:
                // PASS: Do nothing
        }

        $this->save();

        $this->logActivity(ActivityEvent::REMOVED, [
            'removal_reason' => $reason,
            'removal_reason_other' => $otherReason,
        ]);
    }

    public function reinstate()
    {
        $this->disableLogging();

        if ($this->application_status !== ApplicationStatus::REMOVED->name) {
            throw new Exception(ErrorCode::CANDIDATE_UNEXPECTED_STATUS->name);
        }

        // Update the candidates status based on the current status
        // or throw an error if the candidate has an invalid status
        switch ($this->pool_candidate_status) {
            case PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name:
            case PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name:
                $this->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
                $this->computed_final_decision_weight = null;
                break;
            case PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name:
            case PoolCandidateStatus::QUALIFIED_WITHDREW->name:
                $this->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
                $this->computed_final_decision_weight = 10;
                break;
            case PoolCandidateStatus::REMOVED->name:
                $this->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
                $this->computed_final_decision_weight = null;
                break;
            default:
                // PASS: Do nothing
        }

        $this->removed_at = null;
        $this->removal_reason = null;
        $this->removal_reason_other = null;
        $this->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->screening_stage = ScreeningStage::APPLICATION_REVIEW->name;

        $this->save();

        $this->logActivity(ActivityEvent::REINSTATED);
    }

    public function revertPlacement()
    {
        $this->disableLogging();

        $atts = ['pool_candidate_status', 'placed_at', 'placed_department_id'];
        $old = $this->only($atts);

        $this->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->computed_final_decision_weight = 10;
        $this->placed_at = null;
        $this->placed_department_id = null;

        $this->save();

        $this->logActivity(ActivityEvent::REVERTED,
            $this->only($atts),
            $old
        );

    }

    public function revertFinalDecision()
    {
        $this->disableLogging();

        $atts = ['pool_candidate_status', 'expiry_date', 'final_decision_at', 'screening_stage'];
        $old = $this->only($atts);

        $this->pool_candidate_status = PoolCandidateStatus::UNDER_ASSESSMENT->name;
        $this->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->expiry_date = null;
        $this->final_decision_at = null;
        $this->screening_stage = ScreeningStage::APPLICATION_REVIEW->name;
        $this->computed_final_decision_weight = 40;

        $this->save();

        $this->logActivity(ActivityEvent::REVERTED,
            $this->only($atts),
            $old
        );
    }

    public function logActivity(ActivityEvent $event, ?array $atts = [], ?array $old = [])
    {
        $properties = [];
        if (! empty($atts)) {
            $properties['attributes'] = $atts;
        }

        if (! empty($old)) {
            $properties['old'] = $old;
        }

        activity()
            ->causedBy(Auth::user())
            ->performedOn($this)
            ->event($event->value)
            ->withProperties($properties)
            ->log($event->value);
    }
}
