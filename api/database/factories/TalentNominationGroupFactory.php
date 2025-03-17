<?php

namespace Database\Factories;

use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentNominationUserReview;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TalentNominationGroup>
 */
class TalentNominationGroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'nominee_id' => (defined by caller)
            // 'talent_nomination_event_id' => (defined by caller)
            'advancement_decision' => $this->faker->optional->randomElement(array_column(TalentNominationGroupDecision::cases(), 'name')),
            'advancement_reference_confirmed' => $this->faker->optional->boolean(),
            'advancement_notes' => $this->faker->optional->sentence(),
            'lateral_movement_decision' => $this->faker->optional->randomElement(array_column(TalentNominationGroupDecision::cases(), 'name')),
            'lateral_movement_notes' => $this->faker->optional->sentence(),
            'development_program_decision' => $this->faker->optional->randomElement(array_column(TalentNominationGroupDecision::cases(), 'name')),
            'development_program_notes' => $this->faker->optional->sentence(),
            'computed_status' => $this->faker->optional->randomElement(array_column(TalentNominationUserReview::cases(), 'name')),
        ];
    }
}
