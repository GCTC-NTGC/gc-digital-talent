<?php

namespace Database\Factories;

use App\Enums\ApplicationStatus;
use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentResultType;
use App\Enums\CandidateRemovalReason;
use App\Enums\ClaimVerificationResult;
use App\Enums\EducationRequirementOption;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateStatus;
use App\Enums\ScreeningStage;
use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;

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
            'user_id' => User::factory(),
            'pool_id' => Pool::factory()->published(),
            'application_status' => ApplicationStatus::DRAFT->name,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
        ];
    }

    public function submitted(): self
    {
        return $this->state(function () {
            return [
                'application_status' => ApplicationStatus::TO_ASSESS->name,
                'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
                'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
                'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
                'signature' => $this->faker->name,
                'submitted_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            ];
        })->afterCreating(function (PoolCandidate $candidate) {
            $user = $candidate->user;
            $pool = $candidate->pool;
            $updates = [];
            //  TO DO: Do we complete the user profile?

            // Education requirement
            $eduRequirement = $this->faker->randomElement(EducationRequirementOption::classificationRequirements($pool->classification->group));
            $updates['education_requirement_option'] = $eduRequirement;
            if ($eduRequirement === EducationRequirementOption::EDUCATION->name) {
                $eduExp = $user->educationExperiences->first() ??
                    EducationExperience::factory()->for($candidate->user)->create();
                $candidate->educationRequirementEducationExperiences()->sync([$eduExp->id]);
            } else {
                $exp = $user->workExperiences->first() ?? WorkExperience::factory()->for($candidate->user)->create();
                $candidate->educationRequirementWorkExperiences()->sync([$exp->id]);
            }

            // Skill requirements
            $pool->essentialSkills->each(function ($skill) use ($user) {
                $userSkill = UserSkill::firstOrCreate([
                    'user_id' => $user->id,
                    'skill_id' => $skill->id,
                ], [
                    'skill_level' => $this->randomEnum(SkillLevel::class),
                    'when_skill_used' => $this->randomEnum(WhenSkillUsed::class),
                ]);

                // Only attach to an experience if it's not already linked
                $experience = $user->experiences->random();
                if (! $experience->userSkills()->where('user_skills.id', $userSkill->id)->exists()) {
                    $experience->userSkills()->attach($userSkill->id, ['details' => $this->faker->paragraph()]);
                }
            });

            // Answer all questions
            $pool->generalQuestions->each(fn ($q) => $candidate->generalQuestionResponses()->create([
                'general_question_id' => $q->id, 'answer' => $this->faker->paragraph(),
            ]));
            $pool->screeningQuestions->each(fn ($q) => $candidate->screeningQuestionResponses()->create([
                'screening_question_id' => $q->id, 'answer' => $this->faker->paragraph(),
            ]));

            // Verification
            if ($user->armed_forces_status === ArmedForcesStatus::VETERAN->name) {
                $updates['veteran_verification'] = ClaimVerificationResult::UNVERIFIED->name;
            }
            if ($user->has_priority_entitlement) {
                $updates['priority_verification'] = ClaimVerificationResult::UNVERIFIED->name;
            }

            if (! empty($updates)) {
                $candidate->update($updates);
            }
            $candidate->setApplicationSnapshot();
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
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => $this->faker->randomElement(PlacementType::searchable()),
                'referring' => true,
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
                'application_status' => ApplicationStatus::REMOVED->name,
                'removal_reason' => CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name,
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
