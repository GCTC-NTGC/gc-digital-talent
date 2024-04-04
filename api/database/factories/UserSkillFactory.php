<?php

namespace Database\Factories;

use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserSkillFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UserSkill::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::select('id')->inRandomOrder()->first() ?? User::factory(),
            'skill_id' => Skill::select('id')->inRandomOrder()->first() ?? Skill::factory(),
            'skill_level' => $this->faker->randomElement(SkillLevel::cases())->name,
            'when_skill_used' => $this->faker->randomElement(WhenSkillUsed::cases())->name,
            'top_skills_rank' => $this->faker->boolean(25) ? $this->faker->randomDigitNotZero() : null,
            'improve_skills_rank' => $this->faker->boolean(25) ? $this->faker->randomDigitNotZero() : null,
        ];
    }

    public function configure()
    {
        return $this;
    }
}
