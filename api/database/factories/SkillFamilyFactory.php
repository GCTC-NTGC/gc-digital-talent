<?php

namespace Database\Factories;

use App\Models\SkillFamily;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFamilyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SkillFamily::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->catchPhrase();
        return [
            'key' => KeyStringHelpers::toKeyString($name),
            'name' => ['en' => $name . ' EN', 'fr' => $name . ' FR'],
            'description' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
            'category' => $this->faker->randomElement(['TECHNICAL', 'BEHAVIOURAL'])
        ];
    }

    public function configure()
    {
        return $this;
    }
}
