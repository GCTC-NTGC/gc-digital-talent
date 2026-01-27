<?php

namespace Database\Factories;

use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentResultType;
use App\Enums\CandidateRemovalReason;
use App\Enums\ClaimVerificationResult;
use App\Enums\EducationRequirementOption;
use App\Enums\EmploymentCategory;
use App\Enums\PoolCandidateStatus;
use App\Enums\ScreeningStage;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\GeneralQuestionResponse;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\ScreeningQuestionResponse;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class PoolCandidateFactory extends Factory
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
        $relevantStatusesForFinalDecision = PoolCandidateStatus::finalDecisionGroup();
        $placedStatuses = PoolCandidateStatus::placedGroup();
        $placedDepartmentId = Department::inRandomOrder()
            ->limit(1)
            ->pluck('id')
            ->first();
        $removedStatuses = PoolCandidateStatus::removedGroup();

        return [
            'expiry_date' => $this->faker->dateTimeBetween('-1 years', '3 years'),
            'pool_candidate_status' => $this->faker->boolean() ?
                $this->faker->randomElement([PoolCandidateStatus::QUALIFIED_AVAILABLE, PoolCandidateStatus::PLACED_CASUAL])->name :
                $this->faker->randomElement(PoolCandidateStatus::cases())->name,
            'screening_stage' => function (array $attributes) {
                if (in_array($attributes['pool_candidate_status'], PoolCandidateStatus::screeningStageGroup())) {
                    return $attributes['pool_candidate_status'];
                }

                return null;
            },
            'user_id' => User::factory(),
            'pool_id' => Pool::factory()->published(),
            'notes' => $this->faker->paragraphs(3, true),
            'submitted_at' => null,
            'suspended_at' => null,
            'signature' => null,
            'submitted_steps' => array_slice(
                array_column(ApplicationStep::cases(), 'name'),
                0,
                $this->faker->numberBetween(0, count(ApplicationStep::cases()) - 2)
            ),
            'is_flagged' => $this->faker->boolean(10),
            'final_decision_at' => function (array $attributes) use ($relevantStatusesForFinalDecision) {
                return in_array($attributes['pool_candidate_status'], $relevantStatusesForFinalDecision) ?
                $this->faker->dateTimeBetween('-4 weeks', '-2 weeks') : null;
            },
            'placed_at' => function (array $attributes) use ($placedStatuses) {
                return in_array($attributes['pool_candidate_status'], $placedStatuses) ?
                $this->faker->dateTimeBetween('-2 weeks', 'now') : null;
            },
            'placed_department_id' => function (array $attributes) use ($placedStatuses, $placedDepartmentId) {
                return in_array($attributes['pool_candidate_status'], $placedStatuses) ?
                $placedDepartmentId : null;
            },
            'removed_at' => function (array $attributes) use ($removedStatuses) {
                return in_array($attributes['pool_candidate_status'], $removedStatuses) ?
                $this->faker->dateTimeBetween('-2 weeks', 'now') : null;
            },
            'removal_reason' => function (array $attributes) use ($removedStatuses) {
                return in_array($attributes['pool_candidate_status'], $removedStatuses) ?
                $this->faker->randomElement(CandidateRemovalReason::cases())->name : null;
            },
            'removal_reason_other' => function (array $attributes) {
                return $attributes['removal_reason'] === CandidateRemovalReason::OTHER->name ?
                $this->faker->sentence() : null;
            },
            // we don't know yet if the user is a veteran so we'll force consistency later in the afterCreating callback
            'veteran_verification' => $this->faker->optional()->randomElement(array_column(ClaimVerificationResult::cases(), 'name')),
            'veteran_verification_expiry' => function (array $attributes) {
                if ($attributes['veteran_verification'] == ClaimVerificationResult::ACCEPTED) {
                    return $this->faker->dateTimeBetween('6 months', '24 months');
                }
            },
            // we don't know yet if the user has priority so we'll force consistency later in the afterCreating callback
            'priority_verification' => $this->faker->optional()->randomElement(array_column(ClaimVerificationResult::cases(), 'name')),
            'priority_verification_expiry' => function (array $attributes) {
                if ($attributes['priority_verification'] == ClaimVerificationResult::ACCEPTED) {
                    return $this->faker->dateTimeBetween('6 months', '24 months');
                }
            },
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (PoolCandidate $poolCandidate) {
            // after setting pool_candidate_status, check what it is and update accordingly, give it a submitted date if it isn't DRAFT or DRAFT_EXPIRED
            // add a signature in the above case too
            // grab status from database directly, bypassing the Accessor in order to avoid the Accessor overriding in some cases
            $candidateId = $poolCandidate->id;
            $results = DB::select('select pool_candidate_status from pool_candidates where id = :id', ['id' => $candidateId]);
            $candidateStatus = $results[0]->pool_candidate_status;
            if ($candidateStatus != PoolCandidateStatus::DRAFT->name && $candidateStatus != PoolCandidateStatus::DRAFT_EXPIRED->name) {
                $submittedDate = $this->faker->dateTimeBetween('-3 months', 'now');
                $fakeSignature = $this->faker->firstName();
                $step = $poolCandidate->pool->assessmentSteps->first();
                $poolCandidate->update([
                    'submitted_at' => $submittedDate,
                    'signature' => $fakeSignature,
                    'screening_stage' => in_array($poolCandidate->pool_candidate_status, PoolCandidateStatus::screeningStageGroup()) ? $this->faker->randomElement(ScreeningStage::cases())->name : null,
                    'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
                    'assessment_step_id' => $step?->id ?? null,
                ]);
            }

            // if the attached pool has general questions, generate responses
            $generalQuestionsIdArray = $poolCandidate->pool->generalQuestions()->pluck('id')->toArray();
            if (isset($generalQuestionsIdArray) && count($generalQuestionsIdArray) > 0) {
                for ($i = 0; $i < count($generalQuestionsIdArray); $i++) {
                    GeneralQuestionResponse::create([
                        'pool_candidate_id' => $candidateId,
                        'general_question_id' => $generalQuestionsIdArray[$i],
                        'answer' => $this->faker->paragraph(),
                    ]);
                }
            }

            // if the attached pool has screening questions, generate responses
            $screeningQuestionsIdArray = $poolCandidate->pool->screeningQuestions()->pluck('id')->toArray();
            if (isset($screeningQuestionsIdArray) && count($screeningQuestionsIdArray) > 0) {
                for ($i = 0; $i < count($screeningQuestionsIdArray); $i++) {
                    ScreeningQuestionResponse::factory()->create([
                        'pool_candidate_id' => $candidateId,
                        'screening_question_id' => $screeningQuestionsIdArray[$i],
                        'answer' => $this->faker->paragraph(),
                    ]);
                }
            }

            // set education requirement option, influenced by classification of pool
            $classification = $poolCandidate->pool->classification;
            if ($classification) {
                if ($classification->group === 'EX') {
                    $poolCandidate->update([
                        'education_requirement_option' => EducationRequirementOption::PROFESSIONAL_DESIGNATION->name,
                    ]);
                } else {
                    $requirementOption = $this->faker->boolean() ? EducationRequirementOption::APPLIED_WORK->name : EducationRequirementOption::EDUCATION->name;
                    $poolCandidate->update([
                        'education_requirement_option' => $requirementOption,
                    ]);
                }
            }

            // attach either a work or education experience to a pool candidate to meet minimum criteria
            if ($poolCandidate->education_requirement_option === EducationRequirementOption::EDUCATION->name ||
            $poolCandidate->education_requirement_option === EducationRequirementOption::PROFESSIONAL_DESIGNATION->name) {
                // Ensure user has at least one education experience
                $experience = EducationExperience::where('user_id', $poolCandidate->user_id)->first();
                if (! $experience) {
                    $experience = EducationExperience::factory()->create([
                        'user_id' => $poolCandidate->user_id,
                    ]);
                }
                $poolCandidate->educationRequirementEducationExperiences()->sync([$experience->id]);
            } elseif ($poolCandidate->education_requirement_option === EducationRequirementOption::APPLIED_WORK->name) {
                // Ensure user has at least one work experience
                $experience = WorkExperience::where('user_id', $poolCandidate->user_id)->first();
                if (! $experience) {
                    $experience = WorkExperience::factory()->create([
                        'user_id' => $poolCandidate->user_id,
                        'employment_category' => EmploymentCategory::EXTERNAL_ORGANIZATION->name,
                    ]);
                }
                $poolCandidate->educationRequirementWorkExperiences()->sync([$experience->id]);
            }

            // ensure claim verification is consistent
            if ($poolCandidate->user->armed_forces_status != ArmedForcesStatus::VETERAN->name
            && ! is_null($poolCandidate->veteran_verification)) {
                $poolCandidate->update([
                    'veteran_verification' => null,
                    'veteran_verification_expiry' => null,
                ]);
            }
            // ensure claim verification is consistent
            if (! $poolCandidate->user->has_priority_entitlement
            && ! is_null($poolCandidate->priority_verification)) {
                $poolCandidate->update([
                    'priority_verification' => null,
                    'priority_verification_expiry' => null,
                ]);
            }
        });
    }

    /**
     * Pool Candidates are available in search if they are not expired, not suspended, and have the AVAILABLE status.
     *
     * @return void
     */
    public function availableInSearch()
    {
        return $this->state(function () {
            return [
                'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                'expiry_date' => $this->faker->dateTimeBetween('1 years', '3 years'),
                'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
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
        return $this->state(function () {
            return [
                'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                'expiry_date' => $this->faker->dateTimeBetween('1 years', '3 years'),
                'suspended_at' => $this->faker->dateTimeBetween('-3 months', '-1 minute'),
                'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
            ];
        });
    }

    /** Add assessment results to the pool candidate
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
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
