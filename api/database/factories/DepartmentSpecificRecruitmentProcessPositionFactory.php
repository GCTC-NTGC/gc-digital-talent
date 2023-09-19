<?php

namespace Database\Factories;

use App\Enums\DirectiveForms\PositionEmploymentType;
use App\Models\DepartmentSpecificRecruitmentProcessPosition;
use ErrorException;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DepartmentSpecificRecruitmentProcessPosition>
 */
class DepartmentSpecificRecruitmentProcessPositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'classification_group' => $this->faker->regexify('[A-Z]{2}'),
            'classification_level' => $this->faker->regexify('0[0-9]'),
            'job_title' => $this->faker->jobTitle(),
            'employment_types' => $this->faker->randomElements(
                array_column(PositionEmploymentType::cases(), 'name'),
                $this->faker->numberBetween(1, count(PositionEmploymentType::cases()))
            ),
            'employment_types_other' => function (array $attributes) {
                return in_array(PositionEmploymentType::OTHER->name, $attributes['employment_types']) ? $this->faker->word() : null;
            },

        ];
    }

    public function configure()
    {
        return $this
            ->afterMaking(function (DepartmentSpecificRecruitmentProcessPosition $position) {
                if (is_null($position->department_specific_recruitment_process_form_id)) {
                    // https://laravel.com/docs/10.x/eloquent-factories#belongs-to-relationships
                    throw new ErrorException('department_specific_recruitment_process_form_id must be set to use this factory.  Try calling this factory with the `for` method to specify the parent form.');
                }
            });
    }
}
