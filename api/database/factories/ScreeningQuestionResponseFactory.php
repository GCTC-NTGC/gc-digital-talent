<?php

namespace Database\Factories;

use App\Models\ScreeningQuestionResponse;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScreeningQuestionResponseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ScreeningQuestionResponse::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // pool candidate id and screening question id omitted to force failure if not passed into create()
        return [
            'answer' => $this->faker->paragraph(),
        ];
    }
}
