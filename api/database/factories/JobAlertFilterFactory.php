<?php

namespace Database\Factories;

use App\Enums\LanguageAbility;
use App\Enums\PoolAreaOfSelection;
use App\Models\JobAlertFilter;

/**
 * @extends BaseFactory<JobAlertFilter>
 */
class JobAlertFilterFactory extends BaseFactory
{
    protected $model = JobAlertFilter::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'eligibility' => $this->faker->enums(PoolAreaOfSelection::class),
            'languages' => $this->faker->enums(LanguageAbility::class),
        ];
    }
}
