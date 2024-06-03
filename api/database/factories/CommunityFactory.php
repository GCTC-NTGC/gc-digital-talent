<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Community::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->company();
        $description = $this->faker->sentence();

        return [
            'key' => $this->faker->slug(2),
            'name' => ['en' => $name.' EN', 'fr' => $name.' FR'],
            'description' => ['en' => $description.' EN', 'fr' => $description.' FR'],
        ];
    }

    // public function configure()
    // {
    //     return $this->afterCreating(function (Community $community) {
    //         // fill in later
    //     });
    // }

    /**
     * Create a new community or get an existing community based on the given attributes.
     *
     * @param  array  $attributes  The attributes of the community.
     * @return Community The created or existing community.
     */
    public function createOrGetExisting($attributes = [])
    {
        $community = Community::where('name->en', $attributes['name']['en'])
            ->where('name->fr', $attributes['name']['fr'])
            ->first();

        if ($community) {
            return $community;
        }

        return $this->create($attributes);
    }

    // Add a team with at least one member to the community
    public function withTeamMembers()
    {
        return $this->afterCreating(function (Community $community) {
            $team = Team::factory()->withTeamMembers()->create();
            $team->teamable()->associate($community)->save();
        });
    }
}
