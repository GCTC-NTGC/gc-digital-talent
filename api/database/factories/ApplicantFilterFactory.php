<?php

namespace Database\Factories;

use App\Models\ApplicantFilter;
use App\Models\ApplicantFilterPoolRecord;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\ApiEnums;

class ApplicantFilterFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ApplicantFilter::class;

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
            'would_accept_temporary' => $this->faker->boolean(),
            'language_ability' => $this->faker->randomElement(ApiEnums::languageAbilities()),
            'location_preferences' => $this->faker->randomElements(
                ApiEnums::workRegions(),
                $this->faker->numberBetween(1, 3)
            ),
            'operational_requirements' => $this->faker->optional->randomElements(
                ApiEnums::operationalRequirements(),
                $this->faker->numberBetween(1, 4)
            ),
        ];
    }

    /**
     * Create an ApplicantFilter where fields have a 50% chance to be null.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function sparse()
    {
        return $this->state(function (array $attributes) {
            $sparseAttributes = [];
            foreach ($attributes as $key => $value) {
                if ($this->faker->boolean(50)) {
                    $sparseAttributes[$key] = $value;
                }
            }
            return $sparseAttributes;
        });
    }

    /**
     * Create an ApplicantFilter where skills, classifications and ApplicantFilterPoolRecords have been added.
     * NOTE: before using this method, you must have already generated skills, classifications and Pools
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withRelationships(bool $sparse = false)
    {
        return $this->afterCreating(function (ApplicantFilter $filter) use ($sparse) {
            $minCount = $sparse ? 0 : 1;
            $classifications = Classification::inRandomOrder()->limit(
                $this->faker->numberBetween($minCount, 2)
            )->get();
            $filter->classifications()->saveMany($classifications);

            $skills = Skill::inRandomOrder()->limit(
                $this->faker->numberBetween($minCount, 2)
            )->get();
            $filter->skills()->saveMany($skills);

            $pools = Pool::inRandomOrder()->limit(
                $this->faker->numberBetween($minCount, 1)
            )->get();
            $filter->pools()->saveMany($pools);
            // $pools->each(function (Pool $pool) use ($filter, $sparse) {
            //     $recordFactory = ApplicantFilterPoolRecord::factory();
            //     if ($sparse) {
            //         $recordFactory = $recordFactory->sparse();
            //     }
            //     $filter->applicantFilterPoolRecords()->save($recordFactory->make([
            //         'pool_id' => $pool->id,
            //         'applicant_filter_id' => $filter->id,
            //     ]));
            // });
        });
    }
}
