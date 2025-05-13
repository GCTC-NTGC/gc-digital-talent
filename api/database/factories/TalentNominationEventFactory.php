<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\DevelopmentProgram;
use App\Models\TalentNominationEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TalentNominationEvent>
 */
class TalentNominationEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->catchPhrase();
        $description = $this->faker->sentence();
        $openDate = $this->faker->dateTimeBetween();
        $learnMore = $this->faker->optional()->url();

        return [
            'name' => [
                'en' => $name.' EN',
                'fr' => $name.' FR',
            ],
            'description' => [
                'en' => $description.' EN',
                'fr' => $description.' FR',
            ],
            'open_date' => $openDate,
            'close_date' => $this->faker->dateTimeBetween($openDate, '+2 year'),
            'include_leadership_competencies' => $this->faker->boolean(),
            'learn_more_url' => $learnMore ? [
                'en' => $learnMore.'/en',
                'fr' => $learnMore.'/fr',
            ] : null,
            'community_id' => function () {
                $community = Community::inRandomOrder()->firstOr(fn () => Community::factory()->create());

                return $community->id;
            },
        ];
    }

    /**
     * Create many development program relationships
     */
    public function withDevelopmentPrograms(?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (TalentNominationEvent $talentNominationEvent) use ($count) {
            $developmentPrograms = DevelopmentProgram::factory()->count($count)->create(['community_id' => $talentNominationEvent->community_id]);

            $talentNominationEvent->developmentPrograms()->attach($developmentPrograms);
        });
    }
}
