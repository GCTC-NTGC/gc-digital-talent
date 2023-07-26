<?php

namespace Database\Factories;

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
            'user_id' => User::factory(),
            'skill_id' => Skill::factory(),
        ];
    }

    public function configure()
    {
        return $this;
    }
}
