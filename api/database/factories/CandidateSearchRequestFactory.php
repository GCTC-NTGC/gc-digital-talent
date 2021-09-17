<?php

namespace Database\Factories;

use App\Models\CandidateSearchRequest;
use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Department;
use App\Models\OperationalRequirement;
use App\Models\PoolCandidateFilter;
use Illuminate\Database\Eloquent\Factories\Factory;

class CandidateSearchRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CandidateSearchRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
      return [
        'full_name' => $this->faker->name(),
        'email' => $this->faker->unique()->safeEmail,
        'department_id' => Department::inRandomOrder()->first()->id,
        'job_title' => $this->faker->jobTitle(),
        'additional_comments' => $this->faker->text(),
        'requested_date' => $this->faker->date(),
        'status' => $this->faker->randomElement(['PENDING', 'DONE']),
        'admin_notes' => $this->faker->text(),
      ];
    }
}
