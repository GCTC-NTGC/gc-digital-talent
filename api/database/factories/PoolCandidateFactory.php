<?php

namespace Database\Factories;

use App\Enums\ApplicationStep;
use App\Enums\AssessmentResultType;
use App\Enums\EducationRequirementOption;
use App\Enums\PoolCandidateStatus;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
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
        return [
            'cmo_identifier' => $this->faker->word(),
            'expiry_date' => $this->faker->dateTimeBetween('-1 years', '3 years'),
            'pool_candidate_status' => $this->faker->boolean() ?
                $this->faker->randomElement([PoolCandidateStatus::QUALIFIED_AVAILABLE, PoolCandidateStatus::PLACED_CASUAL])->name :
                $this->faker->randomElement(PoolCandidateStatus::cases())->name,
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
            'is_bookmarked' => $this->faker->boolean(10),
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
                $poolCandidate->update([
                    'submitted_at' => $submittedDate,
                    'signature' => $fakeSignature,
                    'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
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
            $classificationOne = $poolCandidate->pool->classifications()->first()->group;
            if ($classificationOne === 'EX') {
                $poolCandidate->update([
                    'education_requirement_option' => EducationRequirementOption::PROFESSIONAL_DESIGNATION->name,
                ]);
            } else {
                $requirementOption = $this->faker->boolean() ? EducationRequirementOption::APPLIED_WORK->name : EducationRequirementOption::EDUCATION->name;
                $poolCandidate->update([
                    'education_requirement_option' => $requirementOption,
                ]);
            }

            // attach either a work or education experience to a pool candidate to meet minimum criteria
            if ($poolCandidate->education_requirement_option === EducationRequirementOption::EDUCATION->name ||
            $poolCandidate->education_requirement_option === EducationRequirementOption::PROFESSIONAL_DESIGNATION->name) {
                //Ensure user has at least one education experience
                $experience = EducationExperience::factory()->create([
                    'user_id' => $poolCandidate->user_id,
                ]);
                $poolCandidate->educationRequirementEducationExperiences()->sync([$experience->id]);
            } elseif ($poolCandidate->education_requirement_option === EducationRequirementOption::APPLIED_WORK->name) {
                //Ensure user has at least one work experience
                $experience = WorkExperience::factory()->create([
                    'user_id' => $poolCandidate->user_id,
                ]);
                $poolCandidate->educationRequirementWorkExperiences()->sync([$experience->id]);
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
    public function withAssessmentResults()
    {
        return $this->afterCreating(function (PoolCandidate $poolCandidate) {
            $poolSkillIds = $poolCandidate->pool->poolSkills()->pluck('id')->toArray();

            AssessmentResult::factory()
                ->withResultType(AssessmentResultType::EDUCATION)
                ->count(1)
                ->create([
                    'assessment_step_id' => AssessmentStep::factory()->create([
                        'pool_id' => $poolCandidate->pool_id,
                    ]),
                    'pool_candidate_id' => $poolCandidate->id,
                ]);

            AssessmentResult::factory()
                ->withResultType(AssessmentResultType::SKILL)
                ->count(4)
                ->create([
                    'assessment_step_id' => AssessmentStep::factory()->create([
                        'pool_id' => $poolCandidate->pool_id,
                    ]),
                    'pool_candidate_id' => $poolCandidate->id,
                    'pool_skill_id' => count($poolSkillIds) > 0 ?
                        array_rand(array_flip($poolSkillIds)) : null,
                ]);
        });
    }
}
