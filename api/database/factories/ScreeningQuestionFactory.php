<?php

namespace Database\Factories;

use App\Models\Pool;
use App\Models\ScreeningQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScreeningQuestionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ScreeningQuestion::class;

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
            'question' => ['en' => $question . ' EN?', 'fr' => $question . ' FR?'],
            'sort_order' => $this->faker->optional->numberBetween(1,10),
        ];
    }
}
