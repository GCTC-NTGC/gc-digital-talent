<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\DevelopmentProgram;

class DevelopmentProgramFactory extends BaseFactory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DevelopmentProgram::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->localizedString($this->faker->company()),
            'description_for_profile' => $this->faker->localizedString($this->faker->sentence()),
            'description_for_nominations' => $this->faker->localizedString($this->faker->sentence()),
            'community_id' => function () {
                $community = Community::inRandomOrder()->firstOr(fn () => Community::factory()->withWorkStreams()->create());

                return $community->id;
            },
            'information_url' => $this->faker->localizedString($this->faker->url()),
            'abbreviation' => $this->faker->localizedString(strtoupper($this->faker->text(5))),
        ];
    }

    // create a CommunityDevelopmentProgram record
    public function withCommunity(string $communityId)
    {
        return $this->afterCreating(function (DevelopmentProgram $program) use ($communityId) {
            CommunityDevelopmentProgram::create(
                [
                    'community_id' => $communityId,
                    'development_program_id' => $program->id,
                ]
            );
        });
    }

    public function withCommunityAndClassifications(string $communityId, ?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (DevelopmentProgram $program) use ($communityId, $count) {
            $communityDevelopmentProgram = CommunityDevelopmentProgram::create(
                [
                    'community_id' => $communityId,
                    'development_program_id' => $program->id,
                ]
            );
            $classifications = Classification::inRandomOrder()->limit($count)->get();
            $communityDevelopmentProgram->classifications()->sync($classifications);
        });
    }
}
