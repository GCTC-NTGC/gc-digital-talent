<?php

namespace Database\Factories;

use App\Models\PersonalExperience;
use App\Models\ExperienceSkill;
use App\Models\Skill;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonalExperienceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PersonalExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->text(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->boolean() ? $this->faker->date() : null,
            'details' => $this->faker->text(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (PersonalExperience $exp) {
            $count = $this->faker->biasedNumberBetween($min = 0, $max = 6, $function = 'Faker\Provider\Biased::linearLow');
            $skills = Skill::inRandomOrder()->get();
            ExperienceSkill::factory()
                ->count($count)
                ->sequence(
                    fn ($sequence) => ['skill_id' => $skills[$sequence->index]->id],
                )
                ->for($exp, 'experience')
                ->create();
        });
    }
}
