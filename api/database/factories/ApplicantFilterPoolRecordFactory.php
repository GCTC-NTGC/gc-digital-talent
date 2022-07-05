<?php

namespace Database\Factories;

use App\Models\ApplicantFilter;
use App\Models\ApplicantFilterPoolRecord;
use App\Models\Pool;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\ApiEnums;

class ApplicantFilterPoolRecordFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ApplicantFilterPoolRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'pool_id' => Pool::factory(),
            'applicant_filter_id' => ApplicantFilter::factory(),
            'expiry_status' => $this->faker->randomElement(ApiEnums::candidateExpiryFilters()),
            'pool_candidate_statuses' => $this->faker->randomElements(
                ApiEnums::candidateStatuses(),
                $this->faker->numberBetween(1, 3)
            ),
        ];
    }

    /**
     * Create an ApplicantFilterPoolRecord where unrequired fields have a 50% chance to be null.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function sparse()
    {
        return $this->state(function (array $attributes) {
            $sparseAttributes = [];
            $requiredAttributes = ['pool_id', 'applicant_filter_id'];
            foreach ($attributes as $key => $value) {
                if (in_array($key, $requiredAttributes) || $this->faker->boolean(50)) {
                    $sparseAttributes[$key] = $value;
                }
            }
            return $sparseAttributes;
        });
    }
}
