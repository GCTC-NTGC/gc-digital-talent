<?php

namespace Database\Factories;

use App\Enums\DirectiveForms\AdvertisementType;
use App\Enums\DirectiveForms\AdvertisingPlatform;
use App\Models\Department;
use App\Models\DepartmentSpecificRecruitmentProcessForm;
use App\Models\DepartmentSpecificRecruitmentProcessPosition;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DepartmentSpecificRecruitmentProcessForm>
 */
class DepartmentSpecificRecruitmentProcessFormFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'department_id' => $this->faker->boolean(75)
                ? Department::inRandomOrder()
                    ->limit(1)
                    ->pluck('id')
                    ->first()
                : null,
            'department_other' => function (array $attributes) {
                return $attributes['department_id'] ? null : $this->faker->company();
            },
            'recruitment_process_lead_name' => $this->faker->name(),
            'recruitment_process_lead_job_title' => $this->faker->jobTitle(),
            'recruitment_process_lead_email' => $this->faker->email(),
            'posting_date' => Carbon::today()->addDays($this->faker->numberBetween(31, 365)),
            'advertisement_type' => $this->faker->randomElement(AdvertisementType::cases())->name,
            'advertising_platforms' => $this->faker->randomElements(
                array_column(AdvertisingPlatform::cases(), 'name'),
                $this->faker->numberBetween(1, count(AdvertisingPlatform::cases()))
            ),
            'advertising_platforms_other' => function (array $attributes) {
                return in_array(AdvertisingPlatform::OTHER->name, $attributes['advertising_platforms']) ? $this->faker->word() : null;
            },
            'job_advertisement_link' => $this->faker->url(),

        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (DepartmentSpecificRecruitmentProcessForm $form) {
            DepartmentSpecificRecruitmentProcessPosition::factory()
                ->count($this->faker->numberBetween(1, 10))
                ->for($form)
                ->create();
        });
    }
}
