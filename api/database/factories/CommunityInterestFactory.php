<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgramInterest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityInterest>
 */
class CommunityInterestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $user = User::inRandomOrder()->first();
        if (! $user) {
            $user = User::factory()->create();
        }

        $community = Community::inRandomOrder()->first();
        if (! $community) {
            $community = Community::factory()->withWorkStreams()->create();
        }

        return [
            'user_id' => $user,
            'community_id' => $community,
            'job_interest' => $this->faker->boolean(),
            'training_interest' => $this->faker->boolean(),
            'additional_information' => $this->faker->paragraph(),
        ];
    }

    /**
     * Create many work stream relationships
     */
    public function withWorkStreams(int $limit = 3)
    {
        $count = $this->faker->numberBetween(1, $limit);

        return $this->afterCreating(function (CommunityInterest $model) use ($count) {
            $workStreams = $model->community->workStreams()->limit($count)->get()->pluck('id');

            $model->workStreams()->attach($workStreams);
        });
    }

    /**
     * Create many development program relationships from the parent community
     */
    public function withDevelopmentProgramInterests(int $limit = 3)
    {
        return $this->afterCreating(function (CommunityInterest $communityInterest) use ($limit) {
            $developmentPrograms = $communityInterest->community->developmentPrograms()->limit($limit)->get();
            foreach ($developmentPrograms as $developmentProgram) {
                DevelopmentProgramInterest::factory()
                    ->for($communityInterest)
                    ->for($developmentProgram)
                    ->create();
            }
        });
    }
}
