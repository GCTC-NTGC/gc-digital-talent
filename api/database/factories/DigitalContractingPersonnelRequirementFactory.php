<?php

namespace Database\Factories;

use App\Models\DigitalContractingPersonnelRequirement;
use App\Models\Skill;
use Database\Helpers\DirectiveFormsApiEnums;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DigitalContractingQuestionnaire>
 */
class DigitalContractingPersonnelRequirementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resource_type' => $this->faker->word(),
            'language' => $this->faker->randomElement(DirectiveFormsApiEnums::personnelLanguages()),
            'language_other' => function (array $attributes) {
                return $attributes['language'] == DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER ? $this->faker->word() : null;
            },
            'security' => $this->faker->randomElement(DirectiveFormsApiEnums::personnelScreeningLevels()),
            'security_other' => function (array $attributes) {
                $attributes['security'] == DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER ? $this->faker->word() : null;
            },
            'telework' => $this->faker->randomElement(DirectiveFormsApiEnums::personnelTeleworkOptions()),
            'quantity' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (DigitalContractingPersonnelRequirement $personnelRequirement) {
            $skillCount = $this->faker->numberBetween(1, 5);
            $personnelRequirement->skills()->syncWithPivotValues(
                Skill::inRandomOrder()->limit($skillCount)->get(),
                ['level' => $this->faker->randomElement(DirectiveFormsApiEnums::personnelSkillExpertiseLevels())],
            );
        });
    }
}
