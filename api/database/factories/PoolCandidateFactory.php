<?php

namespace Database\Factories;

use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\ScreeningQuestionResponse;
use App\Models\User;
use App\Models\WorkExperience;
use App\Providers\PoolCandidateStatus;
use Database\Helpers\ApiEnums;
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
                ApiEnums::applicationSteps(),
                0,
                $this->faker->numberBetween(0, count(ApiEnums::applicationSteps()) - 1)
            ),
            'education_requirement_option' => ApiEnums::poolCandidateCriteria()[array_rand(ApiEnums::poolCandidateCriteria())],
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
                ]);
            }

            // if the attached pool has screening questions, generate responses
            $screeningQuestionsIdArray = $poolCandidate->pool->screeningQuestions()->pluck('id')->toArray();
            if (isset($screeningQuestionsIdArray) && count($screeningQuestionsIdArray) > 0) {
                for ($i = 0; $i < count($screeningQuestionsIdArray); $i++) {
                    ScreeningQuestionResponse::create([
                        'pool_candidate_id' => $candidateId,
                        'screening_question_id' => $screeningQuestionsIdArray[$i],
                        'answer' => $this->faker->paragraph(),
                    ]);
                }
            }

            if ($poolCandidate->education_requirement_option === ApiEnums::EDUCATION_REQUIREMENT_OPTION_EDUCATION) {
                //Ensure user has at least one education experience
                $experience = EducationExperience::factory()->create([
                    'user_id' => $poolCandidate->user_id,
                ]);
                $poolCandidate->educationRequirementEducationExperiences()->sync([$experience->id]);
            } elseif ($poolCandidate->education_requirement_option === ApiEnums::EDUCATION_REQUIREMENT_OPTION_APPLIED_WORK) {
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
                'submitted_steps' => ApiEnums::applicationSteps(),
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
                'submitted_steps' => ApiEnums::applicationSteps(),
            ];
        });
    }
}
