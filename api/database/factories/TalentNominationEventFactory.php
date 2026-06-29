<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\CommunityDevelopmentProgramTalentNominationEvent;
use App\Models\DevelopmentProgram;
use App\Models\TalentNominationEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends BaseFactory<TalentNominationEvent>
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
            'include_nine_box' => $this->faker->boolean(),
            'require_reference_for_advancement' => $this->faker->boolean(),
            'custom_instructions' => $this->faker->localizedString($this->faker->sentences(3, true)),
        ];
    }

    /**
     * Create many development program relationships
     */
    public function withDevelopmentPrograms(?int $min = 1, ?int $max = 3)
    {
        $count = $this->faker->numberBetween($min, $max);

        return $this->afterCreating(function (TalentNominationEvent $talentNominationEvent) use ($count) {
            $developmentPrograms = DevelopmentProgram::factory()
                ->count($count)
                ->create();

            foreach ($developmentPrograms as $developmentProgram) {

                $createdCommunityDevelopmentProgram = CommunityDevelopmentProgram::create(
                    [
                        'community_id' => $talentNominationEvent->community_id,
                        'development_program_id' => $developmentProgram->id,
                    ]
                );
                $description = $this->faker->sentence();

                CommunityDevelopmentProgramTalentNominationEvent::create(
                    [
                        'community_development_program_id' => $createdCommunityDevelopmentProgram->id,
                        'talent_nomination_event_id' => $talentNominationEvent->id,
                        'description_for_nominations' => [
                            'en' => $description.' EN',
                            'fr' => $description.' FR',
                        ],
                    ]
                );
            }
        });
    }
}
