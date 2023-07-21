<?php

namespace Database\Factories;

use App\Models\DigitalContractingPersonnelSkill;
use App\Models\Skill;
use Database\Helpers\DirectiveFormsApiEnums;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DigitalContractingQuestionnaire>
 */
class DigitalContractingPersonnelSkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'level' => $this->faker->randomElement(DirectiveFormsApiEnums::personnelSkillExpertiseLevels())
        ];
    }
}
