<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\TalentNominationEvent;
use App\Models\WorkStream;
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
        $mandateAuthority = $this->faker->optional()->company();

        return [
            'key' => $this->faker->unique()->slug(5),
            'name' => ['en' => $name.' EN', 'fr' => $name.' FR'],
            'description' => ['en' => $description.' EN', 'fr' => $description.' FR'],
            'mandate_authority' => ! is_null($mandateAuthority)
                ? ['en' => $mandateAuthority.' EN', 'fr' => $mandateAuthority.' FR']
                : ['en' => '', 'fr' => ''],
        ];
    }

    public function withWorkStreams(?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (Community $community) use ($count) {
            WorkStream::factory()->count($count)->create(['community_id' => $community->id]);
        });
    }

    public function withTalentNominationEvents(?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (Community $community) use ($count) {
            TalentNominationEvent::factory()
                ->count($count)
                ->withDevelopmentPrograms(2)
                ->create(['community_id' => $community->id]);
        });
    }
}
