<?php

namespace App\Models;

use App\Builders\PoolCandidateBuilder;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\FinalDecision;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\PriorityWeight;
use App\Enums\SkillCategory;
use App\Observers\PoolCandidateObserver;
use App\ValueObjects\ProfileSnapshot;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
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

    public function getEducationRequirementExperiencesAttribute()
    {
        return collect(
            $this->educationRequirementAwardExperiences,
            $this->educationRequirementCommunityExperiences,
            $this->educationRequirementEducationExperiences,
            $this->educationRequirementPersonalExperiences,
            $this->educationRequirementWorkExperiences,
        )->flatten();
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
