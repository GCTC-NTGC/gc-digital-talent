<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\CommunityDevelopmentProgram;
use App\Models\DevelopmentProgram;
use Database\Helpers\FactoryHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class DevelopmentProgramFactory extends Factory
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
            'name' => FactoryHelpers::toFakeLocalizedString($this->faker->company()),
            'description_for_profile' => FactoryHelpers::toFakeLocalizedString($this->faker->sentence()),
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
