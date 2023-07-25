<?php

namespace Database\Factories;

use App\Models\DigitalContractingPersonnelRequirement;
use App\Models\DigitalContractingPersonnelSkill;
use App\Models\Skill;
use Database\Helpers\DirectiveFormsApiEnums;
use ErrorException;
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
                return $attributes['security'] == DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER ? $this->faker->word() : null;
            },
            'telework' => $this->faker->randomElement(DirectiveFormsApiEnums::personnelTeleworkOptions()),
            'quantity' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function configure()
    {
        return $this
            ->afterMaking(function (DigitalContractingPersonnelRequirement $personnelRequirement) {
                if (is_null($personnelRequirement->digital_contracting_questionnaire_id)) {
                    // https://laravel.com/docs/10.x/eloquent-factories#belongs-to-relationships
                    throw new ErrorException("digital_contracting_questionnaire_id must be set to use this factory.  Try calling this factory with the `for` method to specify the parent questionnaire.");
                }
            })
            ->afterCreating(function (DigitalContractingPersonnelRequirement $personnelRequirement) {
                $skills = Skill::inRandomOrder()
                    ->limit($this->faker->numberBetween(1, 5))
                    ->get();
                foreach ($skills as $skill) {
                    DigitalContractingPersonnelSkill::factory()
                        ->for($personnelRequirement)
                        ->for($skill)
                        ->create();
                }
            });
    }
}
