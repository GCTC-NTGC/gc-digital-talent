<?php

namespace Database\Factories;

use App\Enums\DegreeType;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\FellowshipType;
use App\Models\EducationExperience;
use App\Models\User;
use App\Traits\ExperienceFactoryWithSkills;
use Illuminate\Database\Eloquent\Factories\Factory;

class EducationExperienceFactory extends Factory
{
    use ExperienceFactoryWithSkills;

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EducationExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $generalStatuses = [
            EducationStatus::IN_PROGRESS,
            EducationStatus::SUCCESS_CREDENTIAL,
            EducationStatus::SUCCESS_NO_CREDENTIAL,
            EducationStatus::DID_NOT_COMPLETE,
        ];
        $licenseOrCertificationStatuses = [
            EducationStatus::IN_PROGRESS,
            EducationStatus::SUCCESS,
            EducationStatus::DID_NOT_COMPLETE,
        ];

        return [
            'user_id' => User::factory(),
            'institution' => $this->faker->company(),
            'start_date' => $this->faker->dateTimeBetween('2010-01-01', '2019-12-31')->format('Y-m-d'),
            'end_date' => fn ($attributes) => $attributes['status'] !== EducationStatus::IN_PROGRESS->name
                            ? $this->faker->dateTimeBetween($attributes['start_date'], '2019-12-31')?->format('Y-m-d')
                            : null,
            'details' => $this->faker->text(),
            'education_type' => $this->faker->randomElement(EducationType::cases())->name,
            'status' => fn ($attributes) => (
                $attributes['education_type'] === EducationType::LICENSE_ACCREDITATION ||
                $attributes['education_type'] === EducationType::PROFESSIONAL_CERTIFICATION
            )
                ? $this->faker->randomElement($generalStatuses)->name
                : $this->faker->randomElement($licenseOrCertificationStatuses)->name,
            'other_education_type' => fn ($attributes) => $attributes['education_type'] === EducationType::OTHER->name
                            ? $this->faker->word()
                            : null,
            'degree_type' => fn ($attributes) => $attributes['education_type'] === EducationType::DEGREE_DIPLOMA_CERTIFICATE->name
                            ? $this->faker->randomElement(DegreeType::cases())->name
                            : null,
            'area_of_study' => fn ($attributes) => (
                ($attributes['education_type'] === EducationType::DEGREE_DIPLOMA_CERTIFICATE->name &&
                $attributes['degree_type'] !== DegreeType::HIGH_SCHOOL->name) ||
                $attributes['education_type'] === EducationType::INDIVIDUAL_COURSE->name ||
                $attributes['education_type'] === EducationType::FELLOWSHIP->name ||
                $attributes['education_type'] === EducationType::OTHER->name) ? $this->faker->jobTitle() : null,
            'thesis_title' => fn ($attributes) => $attributes['education_type'] === EducationType::DEGREE_DIPLOMA_CERTIFICATE->name && (
                $attributes['degree_type'] === DegreeType::MASTERS_DEGREE->name ||
                $attributes['degree_type'] === DegreeType::PHD->name
            ) ? $this->faker->bs() : null,
            'license_or_accreditation' => fn ($attributes) => $attributes['education_type'] === EducationType::LICENSE_ACCREDITATION->name
                            ? $this->faker->word()
                            : null,
            'certification' => fn ($attributes) => $attributes['education_type'] === EducationType::PROFESSIONAL_CERTIFICATION->name
                            ? $this->faker->word()
                            : null,
            'course_name' => fn ($attributes) => $attributes['education_type'] === EducationType::INDIVIDUAL_COURSE->name
                            ? $this->faker->word()
                            : null,
            'fellowship_type' => fn ($attributes) => $attributes['education_type'] === EducationType::FELLOWSHIP->name
                            ? $this->faker->randomElement(FellowshipType::cases())->name
                            : null,
            'other_fellowship_type' => fn ($attributes) => $attributes['fellowship_type'] === FellowshipType::OTHER->name
                            ? $this->faker->word()
                            : null,
            'prospective_end_date' => fn ($attributes) => $attributes['status'] === EducationStatus::IN_PROGRESS->name
                            ? $this->faker->dateTimeBetween('2040-01-01', '2049-12-31')?->format('Y-m-d')
                            : null,
        ];
    }
}
