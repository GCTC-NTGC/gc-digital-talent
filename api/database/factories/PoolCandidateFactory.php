<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\OperationalRequirement;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PoolCandidateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PoolCandidate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'cmo_identifier' => $this->faker->unique()->word(),
            'expiry_date' => $this->faker->dateTimeBetween('now', '3 years'),
            'is_woman' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_indigenous' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'has_diploma' => $this->faker->boolean(),
            'language_ability' => $this->faker->randomElement(['FRENCH', 'ENGLISH', 'BILINGUAL']),
            'location_preferences' => $this->faker->randomElements(
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
            'location_exemptions' => [
                $this->faker->city(),
                $this->faker->city(),
                $this->faker->city(),
            ],
            'expected_salary' => $this->faker->randomElements(
                [
                    '_50_59K',
                    '_60_69K',
                    '_70_79K',
                    '_80_89K',
                    '_90_99K',
                    '_100K_PLUS',
                ],
                3
            ),
            'would_accept_temporary' => $this->faker->boolean(),
            'pool_candidate_status' => $this->faker->randomElement([
                'AVAILABLE',
                'PLACED_INDETERMINATE',
                'PLACED_TERM',
                'NO_LONGER_INTERESTED',
            ]),
            'user_id' => User::factory(),
            'pool_id' => Pool::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (PoolCandidate $candidate) {
            $assets = CmoAsset::inRandomOrder()->limit(4)->get();
            $classifications = Classification::inRandomOrder()->limit(3)->get();
            $requirements = OperationalRequirement::inRandomOrder()->limit(2)->get();
            $candidate->cmoAssets()->saveMany($assets);
            $candidate->expectedClassifications()->saveMany($classifications);
            $candidate->acceptedOperationalRequirements()->saveMany($requirements);
        });
    }
}
