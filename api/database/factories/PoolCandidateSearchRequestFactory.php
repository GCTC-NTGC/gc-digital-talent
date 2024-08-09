<?php

namespace Database\Factories;

use App\Enums\PoolCandidateSearchPositionType;
use App\Enums\PoolCandidateSearchRequestReason;
use App\Enums\PoolCandidateSearchStatus;
use App\Models\ApplicantFilter;
use App\Models\Community;
use App\Models\Department;
use App\Models\PoolCandidateSearchRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class PoolCandidateSearchRequestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PoolCandidateSearchRequest::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        $communityFetched = Community::inRandomOrder()->first();

        $community = isset($communityFetched) ? $communityFetched : Community::factory()->create();

        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail,
            'department_id' => Department::inRandomOrder()->first()->id,
            'job_title' => $this->faker->jobTitle(),
            'additional_comments' => $this->faker->text(),
            'hr_advisor_email' => $this->faker->unique()->safeEmail,
            'created_at' => $this->faker->dateTimeBetween($startDate = '-6 months', $endDate = '-1 months'),
            'admin_notes' => $this->faker->text(),
            'applicant_filter_id' => ApplicantFilter::factory()->create(['community_id' => $community->id]),
            'was_empty' => $this->faker->boolean(),
            'request_status' => $this->faker->randomElement(array_column(PoolCandidateSearchStatus::cases(), 'name')),
            'request_status_changed_at' => $this->faker->boolean() ? $this->faker->dateTimeBetween($startDate = '-1 months', $endDate = 'now') : null,
            'manager_job_title' => $this->faker->jobTitle(),
            'position_type' => $this->faker->randomElement(PoolCandidateSearchPositionType::cases())->name,
            'reason' => $this->faker->randomElement(PoolCandidateSearchRequestReason::cases())->name,
            'community_id' => $community->id,
        ];
    }

    /**
     * Simulate requests created before the addition of new required fields, for convenient testing/seeding or viewing in frontend
     */
    public function withOldRequests($chanceOfTrue = 20)
    {
        return $this->afterCreating(function (PoolCandidateSearchRequest $request) use ($chanceOfTrue) {
            $isOldRequest = $this->faker->boolean($chanceOfTrue);
            if ($isOldRequest) {
                $request->manager_job_title = null;
                $request->position_type = null;
                $request->hr_advisor_email = null;
                $request->save();
            }
        });
    }
}
