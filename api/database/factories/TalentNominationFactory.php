<?php

namespace Database\Factories;

use App\Enums\NineBoxRating;
use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationNomineeRelationshipToNominator;
use App\Enums\TalentNominationStep;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\Classification;
use App\Models\CommunityDevelopmentProgram;
use App\Models\Department;
use App\Models\SkillFamily;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TalentNominationEvent>
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
                $eventId = value($attributes['talent_nomination_event_id'], $attributes);
                $parentEvent = TalentNominationEvent::find($eventId);

                return [
                    'submitted_steps' => $stepsArray,
                    'nominee_id' => User::where('id', '!=', $attributes['nominator_id'])
                        ->whereIsVerifiedGovEmployee()
                        ->inRandomOrder()
                        ->firstOr(fn () => User::factory()->withGovEmployeeProfile()->create()),
                    'nominee_review' => $this->faker->randomElement((array_column((TalentNominationUserReview::cases()), 'name'))),
                    'nominee_relationship_to_nominator' => $this->faker->randomElement(array_column(TalentNominationNomineeRelationshipToNominator::cases(), 'name')),
                    'nominee_relationship_to_nominator_other' => fn ($attributes) => $attributes['nominee_relationship_to_nominator'] === TalentNominationNomineeRelationshipToNominator::OTHER->name
                            ? $this->faker->jobTitle()
                            : null,
                    // the nine box data might be collected on the nominee step but we're not yet sure
                    'nine_box_performance' => fn ($_) => $parentEvent->include_nine_box
                        ? $this->faker->enum(NineBoxRating::class)
                        : null,
                    'nine_box_leadership_potential' => fn ($_) => $parentEvent->include_nine_box
                        ? $this->faker->enum(NineBoxRating::class)
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
                $eventId = value($attributes['talent_nomination_event_id'], $attributes);
                $parentEvent = TalentNominationEvent::find($eventId);

                return [
                    'submitted_steps' => $stepsArray,

                    'nominate_for_advancement' => $this->faker->boolean(),
                    'nominate_for_lateral_movement' => $this->faker->boolean(),
                    'nominate_for_development_programs' => $parentEvent->developmentProgramsThroughPivot->count() > 0 && $this->faker->boolean(),

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

                    'development_program_options_other' => function ($attributes) use ($parentEvent) {
                        // if nomination for development programs was selected then it is possible to have an 'other' program
                        $nominateForDevelopmentProgramsOptionsSelected = $attributes['nominate_for_development_programs'];
                        // if nominated for development programs then it is possible to have an 'other' program
                        $thereAreDevelopmentProgramsForEvent = $parentEvent->developmentProgramsThroughPivot->count() > 0;

                        $fakedOtherOption = $this->faker->jobTitle();

                        if ($nominateForDevelopmentProgramsOptionsSelected) {

                            if ($thereAreDevelopmentProgramsForEvent) {
                                // if there are other options, a small chance that the OTHER option will be used
                                return $this->faker->boolean(10)
                                    ? $fakedOtherOption
                                    : null;
                            }

                            // if there are no other options, mandatory that the OTHER option will be used
                            return $fakedOtherOption;
                        }

                        return null;
                    },
                ];
            })
            ->afterCreating(function (TalentNomination $talentNomination) {
                $developmentProgramIdsForEvent = $talentNomination->talentNominationEvent->developmentProgramsThroughPivot->pluck('id')->toArray();

                $communityDevelopmentProgramIds = [];
                foreach ($developmentProgramIdsForEvent as $developmentProgramId) {
                    $created = CommunityDevelopmentProgram::firstOrCreate(
                        [
                            'community_id' => $talentNomination->talentNominationEvent->community_id,
                            'development_program_id' => $developmentProgramId,
                        ]
                    );
                    array_push($communityDevelopmentProgramIds, $created->id);
                }

                if ($talentNomination->nominate_for_development_programs) {
                    $talentNomination->communityDevelopmentPrograms()->attach(
                        $this->faker->randomElements(
                            $communityDevelopmentProgramIds,
                            $this->faker->numberBetween(
                                ! is_null($talentNomination->development_program_options_other) ? 0 : 1, // if there is an "other" option already, we can select 0 programs
                                count($communityDevelopmentProgramIds)
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

    public function evaluated(): self
    {
        return $this
            ->submittedReviewAndSubmit()
            ->afterCreating(function (TalentNomination $talentNomination) {
                // TalentNominationObserver already created/linked the group, but leaves decisions null;
                // seed a realistic decision for whichever nomination types were actually requested
                $talentNominationGroup = $talentNomination->talentNominationGroup;

                if ($talentNomination->nominate_for_advancement && is_null($talentNominationGroup->advancement_decision)) {
                    $talentNominationGroup->advancement_decision = $this->faker->randomElement(array_column(TalentNominationGroupDecision::cases(), 'name'));
                    $talentNominationGroup->advancement_reference_confirmed = $this->faker->boolean();
                    $talentNominationGroup->advancement_notes = $this->faker->sentence();
                }

                if ($talentNomination->nominate_for_lateral_movement && is_null($talentNominationGroup->lateral_movement_decision)) {
                    $talentNominationGroup->lateral_movement_decision = $this->faker->randomElement(array_column(TalentNominationGroupDecision::cases(), 'name'));
                    $talentNominationGroup->lateral_movement_notes = $this->faker->sentence();
                }

                $talentNominationGroup->save();
            });
    }
}
