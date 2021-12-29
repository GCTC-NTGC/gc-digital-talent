<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Skill::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->jobTitle();
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'key' => strtolower(preg_replace('/\s+/', '_', $name)),
            'description' => ['en' => $this->faker->paragraph(), 'fr' => $this->faker->paragraph()],
        ];
    }

    public function configure()
    {
        return $this;
    }
}
