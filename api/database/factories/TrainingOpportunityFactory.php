<?php

namespace Database\Factories;

use App\Enums\CourseFormat;
use App\Enums\CourseLanguage;
use App\Models\TrainingOpportunity;
use Illuminate\Database\Eloquent\Factories\Factory;

class TrainingOpportunityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TrainingOpportunity::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $title = $this->faker->jobTitle();
        $description = $this->faker->sentences(3, true);
        $applicationUrl = $this->faker->url();
        $registrationDeadline = $this->faker->dateTimeBetween('-6 months', '6 months');
        $trainingStart = $this->faker->dateTimeBetween($registrationDeadline, '9 months');
        $trainingEnd = $this->faker->optional()->dateTimeBetween($trainingStart, '12 months');

        return [
            'title' => ['en' => $title.' EN', 'fr' => $title.' FR'],
            'description' => ['en' => $description.' EN', 'fr' => $description.' FR'],
            'application_url' => ['en' => $applicationUrl.'EN/', 'fr' => $applicationUrl.'FR/'],
            'registration_deadline' => $registrationDeadline,
            'training_start' => $trainingStart,
            'training_end' => $trainingEnd,
            'course_language' => $this->faker->randomElement(CourseLanguage::cases())->name,
            'course_format' => $this->faker->randomElement(CourseFormat::cases())->name,
        ];
    }

    public function configure()
    {
        return $this;
    }
}
