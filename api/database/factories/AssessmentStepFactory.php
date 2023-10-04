<?php

namespace Database\Factories;

use App\Enums\AssessmentStepType;
use App\Models\AssessmentStep;
use App\Models\Pool;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentStepFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AssessmentStep::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $title = $this->faker->name();

        // some assessment types are special and have controlled handling, do not generate in factory/seeding
        $validAssessmentStepTypes = [
            AssessmentStepType::TECHNICAL_EXAM_AT_SITE->name,
            AssessmentStepType::TECHNICAL_EXAM_AT_HOME->name,
            AssessmentStepType::PSC_EXAM->name,
            AssessmentStepType::INTERVIEW_GROUP->name,
            AssessmentStepType::INTERVIEW_INDIVIDUAL->name,
            AssessmentStepType::INTERVIEW_FOLLOWUP->name,
            AssessmentStepType::REFERENCE_CHECK->name,
            AssessmentStepType::ADDITIONAL_ASSESSMENT->name,
        ];

        return [
            'pool_id' => Pool::factory(),
            'type' => $this->faker->randomElement($validAssessmentStepTypes),
            'sort_order' => $this->faker->numberBetween(1, 10),
            'title' => ['en' => $title.' EN?', 'fr' => $title.' FR?'],
        ];
    }
}
