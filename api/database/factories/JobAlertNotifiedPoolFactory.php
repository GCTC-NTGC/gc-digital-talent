<?php

namespace Database\Factories;

use App\Models\JobAlertNotifiedPool;
use App\Models\Pool;
use App\Models\User;

/**
 * @extends BaseFactory<JobAlertNotifiedPool>
 */
class JobAlertNotifiedPoolFactory extends BaseFactory
{
    protected $model = JobAlertNotifiedPool::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fn () => User::factory(),
            'pool_id' => fn () => Pool::factory()->published(),
        ];
    }
}
