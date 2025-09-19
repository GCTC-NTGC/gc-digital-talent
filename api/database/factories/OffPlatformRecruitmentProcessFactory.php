<?php

namespace Database\Factories;

use App\Enums\HiringPlatform;
use App\Models\Classification;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OffPlatformRecruitmentProcess>
 */
class OffPlatformRecruitmentProcessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->firstOr(
                fn () => User::factory()->create()
            )->id,
            'process_number' => $this->faker->word(),
            'department_id' => Department::inRandomOrder()->firstOr(
                fn () => Department::factory()->create()
            )->id,
            'classification_id' => Classification::inRandomOrder()->firstOr(
                fn () => Classification::factory()->create()
            )->id,
            'platform' => $this->faker->randomElement(array_column(HiringPlatform::cases(), 'name')),
            'platform_other' => fn ($attributes) => $attributes['platform'] === HiringPlatform::OTHER->name
                            ? $this->faker->word()
                            : null,
        ];
    }
}
