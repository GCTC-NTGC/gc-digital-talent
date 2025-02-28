<?php

namespace Database\Factories;

use App\Enums\TalentNominationStep;
use App\Enums\TalentNominationSubmitterRelationship;
use App\Enums\TalentNominationUserReview;
use App\Models\Classification;
use App\Models\Department;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TalentNominationEvent>
 */
class TalentNominationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'submitted_steps' => [],
            'talent_nomination_event_id' => TalentNominationEvent::inRandomOrder()->firstOr(fn () => TalentNominationEvent::factory()->create())->id,
            'submitter_id' => User::inRandomOrder()->firstOr(fn () => User::factory()->create())->id,

        ];
    }

    public function noSubmittedSteps(): self
    {
        // default factory state is the same as "no submitted steps"
        return $this;
    }

    public function submittedInstructions(): self
    {
        return $this
            ->noSubmittedSteps()
            ->state([
                'submitted_steps' => [
                    TalentNominationStep::INSTRUCTIONS->name,
                ],
            ]);
    }

    public function submittedNominatorInformation(): self
    {
        return $this
            ->submittedInstructions()
            ->state(function (array $attributes) {
                $stepsArray = $attributes['submitted_steps'];
                $stepsArray[] = TalentNominationStep::NOMINATOR_INFORMATION->name;

                return [
                    'submitted_steps' => $stepsArray,
                    'nominator_id' => match ($this->faker->numberBetween(1, 3)) {
                        1 => $attributes['submitter_id'], // the nominator is the submitter
                        2 => User::where('id', '!=', $attributes['submitter_id'])  // the nominator is another user, but not the submitter
                            ->inRandomOrder()
                            ->firstOr(fn () => User::factory()->create())
                            ->id,
                        default => null, // the nominator is not a user in the database
                    },
                    'submitter_relationship_to_nominator' => fn ($attributes) => $attributes['nominator_id'] != $attributes['submitter_id']
                            ? $this->faker->randomElement(array_column(TalentNominationSubmitterRelationship::cases(), 'name'))
                            : null,
                    'submitter_relationship_to_nominator_other' => fn ($attributes) => $attributes['submitter_relationship_to_nominator'] === TalentNominationSubmitterRelationship::OTHER->name
                            ? $this->faker->jobTitle()
                            : null,
                    'nominator_fallback_work_email' => fn ($attributes) => is_null($attributes['nominator_id'])
                        ? $this->faker->safeEmail()
                        : null,
                    'nominator_fallback_name' => fn ($attributes) => is_null($attributes['nominator_id'])
                        ? $this->faker->name()
                        : null,
                    'nominator_fallback_classification_id' => fn ($attributes) => is_null($attributes['nominator_id'])
                        ? Classification::inRandomOrder()->firstOr(fn () => Classification::factory()->create())->id
                        : null,
                    'nominator_fallback_department_id' => fn ($attributes) => is_null($attributes['nominator_id'])
                        ? Department::inRandomOrder()->firstOr(fn () => Department::factory()->create())->id
                        : null,
                    'nominator_review' => fn ($attributes) => ! is_null($attributes['nominator_id'])
                        ? $this->faker->randomElement((array_column((TalentNominationUserReview::cases()), 'name')))
                        : null,

                ];
            });
    }
}
