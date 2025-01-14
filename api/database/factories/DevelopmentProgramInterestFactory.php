<?php

namespace Database\Factories;

use App\Enums\DevelopmentProgramParticipationStatus;
use App\Models\DevelopmentProgramInterest;
use ErrorException;
use Illuminate\Database\Eloquent\Factories\Factory;

class DevelopmentProgramInterestFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DevelopmentProgramInterest::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'participation_status' => $this->faker
                ->optional()
                ->randomElement(array_column(DevelopmentProgramParticipationStatus::cases(), 'name')),
            'completion_date' => function ($attributes) {
                return $attributes['participation_status'] === DevelopmentProgramParticipationStatus::COMPLETED->name
                    ? $this->faker->dateTimeBetween('-1 year', 'now')
                    : null;
            },
        ];
    }

    public function configure()
    {
        return $this
            ->afterMaking(function (DevelopmentProgramInterest $model) {
                // https://laravel.com/docs/10.x/eloquent-factories#belongs-to-relationships
                if (is_null($model->development_program_id)) {
                    throw new ErrorException('development_program_id must be set to use this factory.  Try calling this factory with the `for` method to specify the parent development program.');
                }
                if (is_null($model->community_interest_id)) {
                    throw new ErrorException('community_interest_id must be set to use this factory.  Try calling this factory with the `for` method to specify the parent community interest.');
                }
            });
    }
}
