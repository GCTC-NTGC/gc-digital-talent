<?php

namespace Database\Factories;

use App\Models\DigitalContractingPersonnelSkill;
use Database\Helpers\DirectiveFormsApiEnums;
use ErrorException;
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

    public function configure()
    {
        return $this->afterMaking(function (DigitalContractingPersonnelSkill $personnelSkill) {
            if (is_null($personnelSkill->skill_id)) {
                // https://laravel.com/docs/10.x/eloquent-factories#belongs-to-relationships
                throw new ErrorException("skill_id must be set to use this factory.  Try calling this factory with the `for` method to specify the parent skill.");
            }
        });
    }
}
