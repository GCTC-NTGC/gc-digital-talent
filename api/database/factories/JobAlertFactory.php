<?php

namespace Database\Factories;

use App\Models\JobAlert;
use App\Models\JobAlertFilter;
use App\Models\User;

/**
 * @extends BaseFactory<JobAlert>
 */
class JobAlertFactory extends BaseFactory
{
    protected $model = JobAlert::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fn () => User::factory(),
            'name' => $this->faker->words(3, true),
            'is_paused' => false,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (JobAlert $jobAlert) {
            JobAlertFilter::factory()->for($jobAlert)->create();
        });
    }

    public function paused(): self
    {
        return $this->state(fn () => [
            'is_paused' => true,
        ]);
    }
}
