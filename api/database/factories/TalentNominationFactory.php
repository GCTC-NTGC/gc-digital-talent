<?php

namespace Database\Factories;

use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationNomineeRelationshipToNominator;
use App\Enums\TalentNominationStep;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\Classification;
use App\Models\Department;
use App\Models\SkillFamily;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Carbon\Carbon;
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
                            ? $this->faker->randomElement(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name'))
                            : null,
                    'submitter_relationship_to_nominator_other' => fn ($attributes) => $attributes['submitter_relationship_to_nominator'] === TalentNominationSubmitterRelationshipToNominator::OTHER->name
                            ? $this->faker->jobTitle()
                            : null,
                    'nominator_fallback_work_email' => fn ($attributes) => is_null($attributes['nominator_id'])
                        ? $this->faker->userName().'@gc.ca'
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

    public function submittedNomineeInformation(): self
    {
        return $this
            ->submittedNominatorInformation()
            ->state(function (array $attributes) {
                $stepsArray = $attributes['submitted_steps'];
                $stepsArray[] = TalentNominationStep::NOMINEE_INFORMATION->name;

                return [
                    'submitted_steps' => $stepsArray,
                    'nominee_id' => User::where('id', '!=', $attributes['nominator_id'])
                        ->inRandomOrder()
                        ->firstOr(fn () => User::factory()->create()),
                    'nominee_review' => $this->faker->randomElement((array_column((TalentNominationUserReview::cases()), 'name'))),
                    'nominee_relationship_to_nominator' => $this->faker->randomElement(array_column(TalentNominationNomineeRelationshipToNominator::cases(), 'name')),
                    'nominee_relationship_to_nominator_other' => fn ($attributes) => $attributes['nominee_relationship_to_nominator'] === TalentNominationNomineeRelationshipToNominator::OTHER->name
                            ? $this->faker->jobTitle()
                            : null,
                ];
            });
    }

    public function submittedNominationDetails(): self
    {
        return $this
            ->submittedNomineeInformation()
            ->state(function (array $attributes) {
                $stepsArray = $attributes['submitted_steps'];
                $stepsArray[] = TalentNominationStep::NOMINATION_DETAILS->name;
                $parentEvent = TalentNominationEvent::find($attributes['talent_nomination_event_id']);

                return [
                    'submitted_steps' => $stepsArray,

                    'nominate_for_advancement' => $this->faker->boolean(),
                    'nominate_for_lateral_movement' => $this->faker->boolean(),
                    'nominate_for_development_programs' => $parentEvent->developmentPrograms->count() > 0 && $this->faker->boolean(),

                    'advancement_reference_id' => fn ($attributes) => $attributes['nominate_for_advancement'] && $this->faker->boolean()
                        // nominated for advancement and we have the user id
                        ? User::where('id', '!=', $attributes['submitter_id'])
                            ->inRandomOrder()
                            ->firstOr(fn () => User::factory()->create())
                            ->id
                        : null,
                    'advancement_reference_review' => fn ($attributes) => ! is_null($attributes['advancement_reference_id'])
                        ? $this->faker->randomElement((array_column((TalentNominationUserReview::cases()), 'name')))
                        : null,
                    'advancement_reference_fallback_work_email' => fn ($attributes) => $attributes['nominate_for_advancement'] && is_null($attributes['advancement_reference_id'])
                        ? $this->faker->userName().'@gc.ca'
                        : null,
                    'advancement_reference_fallback_name' => fn ($attributes) => $attributes['nominate_for_advancement'] && is_null($attributes['advancement_reference_id'])
                        ? $this->faker->name()
                        : null,
                    'advancement_reference_fallback_classification_id' => fn ($attributes) => $attributes['nominate_for_advancement'] && is_null($attributes['advancement_reference_id'])
                        ? Classification::inRandomOrder()->firstOr(fn () => Classification::factory()->create())->id
                        : null,
                    'advancement_reference_fallback_department_id' => fn ($attributes) => $attributes['nominate_for_advancement'] && is_null($attributes['advancement_reference_id'])
                        ? Department::inRandomOrder()->firstOr(fn () => Department::factory()->create())->id
                        : null,

                    'lateral_movement_options' => fn ($attributes) => $attributes['nominate_for_lateral_movement']
                        ? $this->faker->randomElements(array_column(TalentNominationLateralMovementOption::cases(), 'name'), $this->faker->numberBetween(1, count(TalentNominationLateralMovementOption::cases())))
                        : [],
                    'lateral_movement_options_other' => fn ($attributes) => $attributes['nominate_for_lateral_movement'] && in_array(TalentNominationLateralMovementOption::OTHER->name, $attributes['lateral_movement_options'] ?? [])
                        ? $this->faker->jobTitle()
                        : null,

                    'development_program_options_other' => fn ($attributes) => $attributes['nominate_for_development_programs'] && $this->faker->boolean(10)
                        ? $this->faker->jobTitle()
                        : null,
                ];
            })
            ->afterCreating(function (TalentNomination $talentNomination) {
                if ($talentNomination->nominate_for_development_programs) {
                    $talentNomination->developmentPrograms()->attach(
                        $this->faker->randomElements(
                            $talentNomination->talentNominationEvent->developmentPrograms->pluck('id')->toArray(),
                            $this->faker->numberBetween(
                                ! is_null($talentNomination->development_program_options_other) ? 0 : 1, // if there is an "other" option already, we can select 0 programs
                                $talentNomination->talentNominationEvent->developmentPrograms->count()
                            )
                        )
                    );
                }
            });
    }

    public function submittedRationale(): self
    {
        return $this
            ->submittedNominationDetails()
            ->state(function (array $attributes) {
                $stepsArray = $attributes['submitted_steps'];
                $stepsArray[] = TalentNominationStep::RATIONALE->name;

                return [
                    'submitted_steps' => $stepsArray,
                    'nomination_rationale' => $this->faker->paragraph(),
                    'additional_comments' => $this->faker->paragraph(),
                ];
            })
            ->afterCreating(function (TalentNomination $talentNomination) {
                if ($talentNomination->talentNominationEvent->include_leadership_competencies) {
                    // key leadership competencies
                    $skillIds = SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray();

                    if (count($skillIds) < 3) {
                        throw new \Exception('Not enough key leadership competencies to seed a nomination');
                    }
                    $talentNomination->skills()->sync(
                        $this->faker->randomElements($skillIds, 3)
                    );

                }
            });
    }

    public function submittedReviewAndSubmit(): self
    {
        return $this
            ->submittedRationale()
            ->state(function (array $attributes) {
                $stepsArray = $attributes['submitted_steps'];
                $stepsArray[] = TalentNominationStep::REVIEW_AND_SUBMIT->name;

                return [
                    'submitted_steps' => $stepsArray,
                    'submitted_at' => Carbon::now(),
                ];
            });
    }
}
