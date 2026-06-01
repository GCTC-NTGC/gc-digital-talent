<?php

namespace Database\Factories;

use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestPositionType;
use App\Enums\TalentRequestReason;
use App\Enums\TalentRequestStatus;
use App\Models\ApplicantFilter;
use App\Models\Community;
use App\Models\Department;
use App\Models\TalentRequest;
use App\Models\User;

class TalentRequestFactory extends BaseFactory
{
    protected $model = TalentRequest::class;

    public function definition()
    {
        $community = $this->firstOrCreate(Community::class);

        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail,
            'department_id' => $this->firstOrCreate(Department::class)->id,
            'job_title' => $this->faker->jobTitle(),
            'additional_comments' => $this->faker->text(),
            'hr_advisor_email' => $this->faker->unique()->safeEmail,
            'applicant_filter_id' => ApplicantFilter::factory()->create(['community_id' => $community->id])->id,
            'manager_job_title' => $this->faker->jobTitle(),
            'position_type' => $this->randomEnum(TalentRequestPositionType::class),
            'reason' => $this->randomEnum(TalentRequestReason::class),
            'community_id' => $community->id,
            'user_id' => User::inRandomOrder()->first()?->id,
            'initial_result_count' => $this->faker->optional()->numberBetween(0, 999),
            'status' => TalentRequestStatus::NEW->name,
        ];
    }

    public function inProgress(): self
    {
        return $this->state(fn () => [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => $this->randomEnum(TalentRequestInProgressDetail::class),
            'completion_details' => null,
            'follow_up_date' => $this->faker->optional()->dateTimeBetween('-1 month', '+3 months')?->format('Y-m-d'),
        ]);
    }

    public function completed(): self
    {
        return $this->state(fn () => [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => $this->randomEnum(TalentRequestCompletionDetail::class),
            'in_progress_details' => null,
            'follow_up_date' => null,
        ]);
    }
}
