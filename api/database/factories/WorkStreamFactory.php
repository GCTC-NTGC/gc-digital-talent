<?php

namespace Database\Factories;

use App\Models\Community;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkStream>
 */
class WorkStreamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->company();
        $communityId = Community::inRandomOrder()
            ->pluck('id')
            ->first();
        if (is_null($communityId)) {
            $communityId = Community::factory()->create()->id;
        }

        return [
            'key' => KeyStringHelpers::toKeyString($name),
            'name' => ['en' => $this->faker->name, 'fr' => $this->faker->name],
            'plain_language_name' => ['en' => $this->faker->name, 'fr' => $this->faker->name],
            'community_id' => $communityId,
        ];
    }
}
