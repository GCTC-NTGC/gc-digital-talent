<?php

namespace Database\Factories;

use App\Models\GeneralQuestion;
use App\Models\Pool;
use Illuminate\Database\Eloquent\Factories\Factory;

class GeneralQuestionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GeneralQuestion::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $question = $this->faker->sentence();

        return [
            'pool_id' => Pool::factory(),
            'question' => ['en' => $question.' EN?', 'fr' => $question.' FR?'],
            'sort_order' => $this->faker->optional->numberBetween(1, 10),
        ];
    }
}
