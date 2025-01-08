<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Community;
use App\Models\DevelopmentProgram;
use Database\Helpers\FactoryHelpers;
use ErrorException;
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
            'description_for_nominations' => FactoryHelpers::toFakeLocalizedString($this->faker->sentence()),
            'community_id' => function () {
                $community = Community::inRandomOrder()->firstOr(fn () => Community::factory()->withWorkStreams()->create());

                return $community->id;
            },
        ];
    }

    public function configure()
    {
        return $this
            ->afterMaking(function (DevelopmentProgram $model) {
                // https://laravel.com/docs/10.x/eloquent-factories#belongs-to-relationships
                if (is_null($model->community_id)) {
                    throw new ErrorException('community_id must be set to use this factory.  Try calling this factory with the `for` method to specify the parent community.');
                }
            });
    }

    public function withEligibleClassifications(?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (DevelopmentProgram $program) use ($count) {
            $classifications = Classification::inRandomOrder()->limit($count)->get();
            $program->eligibleClassifications()->sync($classifications);
        });
    }
}
