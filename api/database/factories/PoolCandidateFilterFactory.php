<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Pool;
use App\Models\PoolCandidateFilter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\ApiEnums;

class PoolCandidateFilterFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PoolCandidateFilter::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'has_diploma' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_indigenous' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'is_woman' => $this->faker->boolean(),
            'language_ability' => $this->faker->randomElement(['FRENCH', 'ENGLISH', 'BILINGUAL', null]),
            'work_regions' => $this->faker->randomElements(
                [
                    'TELEWORK',
                    'NATIONAL_CAPITAL',
                    'ATLANTIC',
                    'QUEBEC',
                    'ONTARIO',
                    'PRAIRIE',
                    'BRITISH_COLUMBIA',
                    'NORTH',
                ],
                3
            ),
            'operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (PoolCandidateFilter $filter) {
            $classifications = Classification::inRandomOrder()->limit(3)->get();
            $pools = Pool::inRandomOrder()->limit(1)->get();
            $filter->classifications()->saveMany($classifications);
            $filter->pools()->saveMany($pools);
        });
    }
}
