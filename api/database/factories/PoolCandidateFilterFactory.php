<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Pool;
use App\Models\PoolCandidateFilter;
use App\Models\Skill;
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
     * Most real filters won't use every possible field.
     * This gives a chance of returning null instead of intended value.
     *
     * @param [type] $value
     * @param int $chance Percentage chance of returning $value instead of null.
     * @return void
     */
    function maybe($value, $chance = 40)
    {
        return $this->faker->boolean($chance) ?
            $value : null;
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        return [
            'has_diploma' => $this->maybe($this->faker->boolean()),
            'has_disability' => $this->maybe($this->faker->boolean()),
            'is_indigenous' => $this->maybe($this->faker->boolean()),
            'is_visible_minority' => $this->maybe($this->faker->boolean()),
            'is_woman' => $this->maybe($this->faker->boolean()),
            'language_ability' => $this->maybe($this->faker->randomElement(['FRENCH', 'ENGLISH', 'BILINGUAL', null])),
            'work_regions' => $this->maybe($this->faker->randomElements(
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
            )),
            'operational_requirements' => $this->maybe($this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2)),
            'would_accept_temporary' => $this->maybe($this->faker->boolean()),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (PoolCandidateFilter $filter) {
            if ($this->maybe(true)) {
                $assets = CmoAsset::inRandomOrder()->limit(4)->get();
                $filter->cmoAssets()->saveMany($assets);
            }
            if ($this->maybe(true)) {
                $classifications = Classification::inRandomOrder()->limit(3)->get();
                $filter->classifications()->saveMany($classifications);
            }
            if ($this->maybe(true)) {
                $skills = Skill::inRandomOrder()->limit(3)->get();
                $filter->skills()->saveMany($skills);
            }
            if ($this->maybe(true)) {
                $pools = Pool::inRandomOrder()->limit(1)->get();
                $filter->pools()->saveMany($pools);
            }
        });
    }
}
