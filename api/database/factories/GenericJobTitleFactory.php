<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\GenericJobTitle;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class GenericJobTitleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GenericJobTitle::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->company();
        $randomClassification = Classification::inRandomOrder()->first();
        return [
            'key' => KeyStringHelpers::toKeyString($name),
            'name' => ['en' => $this->faker->name, 'fr' => $this->faker->name],
            'classification_id' => $randomClassification ? $randomClassification->id : null,
        ];
    }
}
