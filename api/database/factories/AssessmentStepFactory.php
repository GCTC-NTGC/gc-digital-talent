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

        return [
            'pool_id' => Pool::factory(),
            'type' => $this->faker->randomElement(AssessmentStepType::cases())->name,
            'sort_order' => $this->faker->numberBetween(1, 10),
            'title' => ['en' => $title.' EN?', 'fr' => $title.' FR?'],
        ];
    }
}
