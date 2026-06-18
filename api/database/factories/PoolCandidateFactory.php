<?php

namespace Database\Factories;

use App\Enums\ApplicationStatus;
use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\CandidateRemovalReason;
use App\Enums\ClaimVerificationResult;
use App\Enums\DisqualificationReason;
use App\Enums\EducationRequirementOption;
use App\Enums\EmploymentCategory;
use App\Enums\PlacementType;
use App\Enums\ScreeningStage;
use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Lang;

class PoolCandidateFactory extends BaseFactory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PoolCandidate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        return [
            'user_id' => fn () => User::factory(),
            'pool_id' => fn () => Pool::factory()->published(),
            'application_status' => ApplicationStatus::DRAFT->name,
        ];
    }

    /**
     * A completed application that has yet to be submitted
     */
    public function completed(): self
    {
        $steps = collect(ApplicationStep::cases())
            ->filter(fn ($step) => $step !== ApplicationStep::REVIEW_AND_SUBMIT)
            ->map(fn ($step) => $step->name)
            ->values()
            ->toArray();

        return $this->state(fn () => ['submitted_steps' => $steps])->afterCreating(function (PoolCandidate $candidate) {
            $user = $candidate->user;
            $pool = $candidate->pool;
            $updates = [];
            //  TO DO: Do we complete the user profile?

            // Education requirement
            $eduRequirement = $this->faker->randomElement(
                EducationRequirementOption::classificationRequirements($pool->classification->group)
            );

            $updates['education_requirement_option'] = $eduRequirement;
            $isEdu = $eduRequirement === EducationRequirementOption::EDUCATION->name;

            if ($isEdu) {
                $exp = $user->educationExperiences->first()
                    ?? EducationExperience::factory()->for($user)->create();
            } else {
                $exp = $user->workExperiences->first()
                    ?? WorkExperience::factory()->for($user)->create([
                        'employment_category' => $user->computed_is_gov_employee
                            ? EmploymentCategory::GOVERNMENT_OF_CANADA->name
                            : EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    ]);
            }

            $relation = $isEdu ? 'educationRequirementEducationExperiences' : 'educationRequirementWorkExperiences';
            $candidate->$relation()->sync([$exp->id]);

            // Refresh to avoid stale relationships
            $user->load(['communityExperiences', 'educationExperiences', 'personalExperiences', 'workExperiences']);

            // Skill requirements
            $pool->essentialSkills->each(function ($skill) use ($user) {
                $userSkill = UserSkill::firstOrCreate([
                    'user_id' => $user->id,
                    'skill_id' => $skill->id,
                ], [
                    'skill_level' => $this->faker->enum(SkillLevel::class),
                    'when_skill_used' => $this->faker->enum(WhenSkillUsed::class),
                ]);

                // Only attach to an experience if it's not already linked
                $experience = $user->experiences->random();
                if (! $experience->userSkills()->where('user_skills.id', $userSkill->id)->exists()) {
                    $experience->userSkills()->attach($userSkill->id, ['details' => $this->faker->paragraph()]);
                }
            });

            // Answer all questions
            $candidate->generalQuestionResponses()->createMany(
                $pool->generalQuestions->map(fn ($q) => ['general_question_id' => $q->id, 'answer' => $this->faker->paragraph()])->toArray()
            );
            $candidate->screeningQuestionResponses()->createMany(
                $pool->screeningQuestions->map(fn ($q) => ['screening_question_id' => $q->id, 'answer' => $this->faker->paragraph()])->toArray()
            );

            // Verification
            if ($candidate->veteran_verification === null && $user->armed_forces_status === ArmedForcesStatus::VETERAN->name) {
                $updates['veteran_verification'] = ClaimVerificationResult::UNVERIFIED->name;
            }
            if ($candidate->priority_verification == null && $user->has_priority_entitlement) {
                $updates['priority_verification'] = ClaimVerificationResult::UNVERIFIED->name;
            }

            if (! empty($updates)) {
                $candidate->fill($updates);
            }
            $candidate->setApplicationSnapshot();
        });
    }

    public function submitted(): self
    {
        return $this->completed()->state([
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
            'signature' => $this->faker->name,
            'submitted_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ]);
    }

    public function screening(?ScreeningStage $stage = null): self
    {
        $stage = $stage?->name ?? $this->faker->enum(ScreeningStage::class);

        return $this->submitted()->state(fn () => [
            'screening_stage' => $stage,
        ])->afterCreating(function (PoolCandidate $candidate) {
            if ($candidate->screening_stage === ScreeningStage::UNDER_ASSESSMENT->name) {
                $stepId = $candidate->pool->assessmentSteps()->inRandomOrder()->whereNotIn('type', [
                    AssessmentStepType::APPLICATION_SCREENING->name,
                    AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name,
                ])->first()->id ?? null;
                $candidate->assessment_step_id = $stepId;
            }
        });
    }

    public function disqualified(?DisqualificationReason $reason = null): self
    {
        $reason = $reason?->name ?? $this->faker->enum(DisqualificationReason::class);

        return $this->submitted()->state(fn () => [
            'application_status' => ApplicationStatus::DISQUALIFIED->name,
            'disqualification_reason' => $reason,
            'screening_stage' => null,
            'assessment_step_id' => null,
        ]);
    }

    public function qualified(): self
    {
        return $this->submitted()->state([
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'screening_stage' => null,
            'assessment_step_id' => null,
            'expiry_date' => $this->faker->dateTimeBetween('+3 months', '+3 years'),
        ]);
    }

    public function expired(): self
    {
        return $this->qualified()->state([
            'expiry_date' => $this->faker->dateTimeBetween('-3 months', '-1 day'),
        ]);
    }

    public function placed(?PlacementType $placementType = null, ?string $deptId = null): self
    {
        $type = $placementType?->name ?? $this->faker->enum(PlacementType::class);
        $factory = $this->qualified();

        // pause referrals if being placed as indeterminate
        if ($type === PlacementType::PLACED_INDETERMINATE->name) {
            $factory = $factory->referring(false)->state([
                'pause_referrals_reason' => Lang::get('common.successfully_placed'),
            ]);
        }

        $hasPlacedStartDate = PlacementType::hasPlacedStartDate($type);
        $isIndeterminate = $type === PlacementType::PLACED_INDETERMINATE->name;

        return $factory->state(fn (array $atts) => [
            'placement_type' => $type,
            'placed_at' => $this->faker->dateTimeBetween($atts['submitted_at'] ?? '-3 months', $atts['expiry_date'] ?? 'now'),
            'placed_department_id' => $deptId ?? $this->firstOrCreate(Department::class)->id,
            'screening_stage' => null,
            'assessment_step_id' => null,
            'placed_start_date' => $hasPlacedStartDate ? $this->faker->dateTimeBetween($atts['submitted_at'] ?? '-3 months', 'now') : null,
            'placed_end_date' => $hasPlacedStartDate && ! $isIndeterminate ? $this->faker->dateTimeBetween('now', $atts['expiry_date']) : null,
        ]);
    }

    public function removed(?CandidateRemovalReason $reason = null, ?string $otherReason = null): self
    {
        $reason = $reason?->name ?? $this->faker->enum(CandidateRemovalReason::class);
        $otherReason = $otherReason ?? $this->faker->sentence();
        if ($reason !== CandidateRemovalReason::OTHER->name) {
            $otherReason = null;
        }

        return $this->submitted()->state(fn () => [
            'application_status' => ApplicationStatus::REMOVED->name,
            'removal_reason' => $reason,
            'removal_reason_other' => $otherReason,
            'screening_stage' => null,
            'assessment_step_id' => null,
        ]);
    }

    /**
     * Pool Candidates are available in search if they are not expired, not suspended, and have the AVAILABLE status.
     *
     * @return void
     */
    public function availableInSearch()
    {
        $name = $this->faker->randomElement(PlacementType::searchable());
        $type = constant(PlacementType::class.'::'.$name);

        return $this->placed($type)->referring(true)->state(fn () => [
            'expiry_date' => $this->faker->dateTimeBetween('1 years', '3 years'),
        ]);
    }

    /**
     * Control the referral status of the candidate.
     */
    public function referring(bool $isReferring = true): self
    {
        return $this->state(function (array $atts) use ($isReferring) {
            if ($isReferring) {
                return [
                    'pause_referrals_at' => null,
                    'resume_referrals_at' => null,
                    'pause_referrals_reason' => null,
                ];
            }

            return [
                'pause_referrals_at' => $this->faker->dateTimeBetween($atts['submitted_at'] ?? '-3 months', 'now'),
                'pause_referrals_reason' => 'Manually paused',
                'resume_referrals_at' => $atts['expiry_date'] ?? now()->addMonths(6),
            ];
        });
    }

    /**
     * Pool Candidates should only be suspended if they have been submitted
     *
     * @return void
     */
    public function suspended()
    {
        return $this->removed(CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN)->state(fn () => [
            'expiry_date' => $this->faker->dateTimeBetween('1 years', '3 years'),
            'suspended_at' => $this->faker->dateTimeBetween('-3 months', '-1 minute'),
        ]);
    }

    /** Add assessment results to the pool candidate
     *
     * @return Factory
     */
    public function withAssessmentResults(): self
    {
        return $this->afterCreating(function (PoolCandidate $poolCandidate) {
            $poolSkillIds = $poolCandidate->pool->poolSkills()->pluck('id')->toArray();

            $educationStep = AssessmentStep::factory()->create([
                'pool_id' => $poolCandidate->pool_id,
            ]);

            AssessmentResult::factory()
                ->withResultType(AssessmentResultType::EDUCATION)
                ->create([
                    'assessment_step_id' => $educationStep->id,
                    'pool_candidate_id' => $poolCandidate->id,
                ]);

            $skillStep = AssessmentStep::factory()->create([
                'pool_id' => $poolCandidate->pool_id,
            ]);

            $assignedSkillIds = collect($poolSkillIds)
                ->shuffle()
                ->take(4)
                ->all();

            foreach ($assignedSkillIds as $skillId) {
                AssessmentResult::factory()
                    ->withResultType(AssessmentResultType::SKILL)
                    ->create([
                        'assessment_step_id' => $skillStep->id,
                        'pool_candidate_id' => $poolCandidate->id,
                        'pool_skill_id' => $skillId,
                    ]);
            }
        });
    }

    /**
     * Create a snapshot for the pool candidate
     */
    public function withSnapshot()
    {
        return $this->afterCreating(function (PoolCandidate $poolCandidate) {
            $poolCandidate->setApplicationSnapshot();
        });
    }

    // Add a poolCandidate bookmark attached to user(s)
    public function withBookmarks(array $userIds)
    {
        return $this->afterCreating(function (PoolCandidate $poolCandidate) use ($userIds) {

            $poolCandidate->bookmarkedByUsers()->attach($userIds);

            return $poolCandidate;
        });
    }
}
