<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Community;
use App\Models\DevelopmentProgram;
use Illuminate\Database\Eloquent\Factories\Factory;

class DevelopmentProgramFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DevelopmentProgram::class;

    private static function toLocalizedArray(string $str): array
    {
        return ['en' => $str.' EN', 'fr' => $str.' FR'];
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this::toLocalizedArray($this->faker->company()),
            'description_for_profile' => $this::toLocalizedArray($this->faker->sentence()),
            'description_for_nominations' => $this::toLocalizedArray($this->faker->sentence()),
            'community_id' => function () {
                $community = Community::inRandomOrder()->first();
                if (! $community) {
                    $community = Community::factory()->withWorkStreams()->create();
                }

                return $community->id;
            },
        ];
    }

    public function withClassifications(?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (DevelopmentProgram $program) use ($count) {
            $classifications = Classification::inRandomOrder()->limit($count)->get();
            $program->classifications()->sync($classifications);
        });
    }
}
