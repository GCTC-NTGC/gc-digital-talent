<?php

namespace Database\Factories;

use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\PositionDuration;
use App\Enums\SkillLevel;
use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestPositionType;
use App\Enums\TalentRequestReason;
use App\Enums\TalentRequestSource;
use App\Enums\TalentRequestStatus;
use App\Enums\WhenSkillUsed;
use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;

class TalentRequestFactory extends BaseFactory
{
    protected $model = TalentRequest::class;

    public function definition()
    {
        $community = $this->firstOrCreate(Community::class);

        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail,
            'department_id' => $this->firstOrCreate(Department::class)->id,
            'job_title' => $this->faker->jobTitle(),
            'additional_comments' => $this->faker->text(),
            'hr_advisor_email' => $this->faker->unique()->safeEmail,
            'applicant_filter_id' => ApplicantFilter::factory()->for($community)->create()->id,
            'manager_job_title' => $this->faker->jobTitle(),
            'position_type' => $this->faker->enum(TalentRequestPositionType::class),
            'reason' => $this->faker->enum(TalentRequestReason::class),
            'community_id' => $community->id,
            'user_id' => User::inRandomOrder()->first()?->id,
            'initial_result_count' => $this->faker->optional()->numberBetween(0, 999),
            'status' => TalentRequestStatus::NEW->name,
        ];
    }

    public function inProgress(): self
    {
        return $this->state(fn () => [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => $this->enum(TalentRequestInProgressDetail::class),
            'completion_details' => null,
            'follow_up_date' => $this->faker->optional()->dateTimeBetween('-1 month', '+3 months')?->format('Y-m-d'),
        ]);
    }

    public function completed(): self
    {
        return $this->state(fn () => [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => $this->faker->enum(TalentRequestCompletionDetail::class),
            'in_progress_details' => null,
            'follow_up_date' => null,
        ]);
    }

    public function withTrackedUsers(int $count = 3): self
    {
        return $this->afterCreating(function (TalentRequest $talentRequest) use ($count) {
            TalentRequestTrackedUser::factory()
                ->count($count)
                ->withRandomState()
                ->for($talentRequest)
                ->sequence(fn () => ['user_id' => $this->createUser($talentRequest->applicantFilter)->id])
                ->create();
        });
    }

    public function withMatchingUsers(int $count = 3): self
    {
        return $this->afterCreating(function (TalentRequest $talentRequest) use ($count) {
            for ($i = 0; $i < $count; $i++) {
                $this->createUser($talentRequest->applicantFilter);
            }
        });
    }

    public function withMatchingUserPerSourceCombination(): self
    {
        return $this->afterCreating(function (TalentRequest $talentRequest) {
            $filter = $talentRequest->applicantFilter;

            $combinations = [[]];
            foreach (TalentRequestSource::selected($filter->talent_sources) as $source) {
                foreach ($combinations as $combination) {
                    $combinations[] = [...$combination, $source];
                }
            }
            array_shift($combinations);

            foreach ($combinations as $sources) {
                $this->createUser($filter, $sources);
            }
        });
    }

    private function randomSources(ApplicantFilter $filter): array
    {
        $selected = TalentRequestSource::selected($filter->talent_sources);

        $matchesQualifiedInPool = in_array(TalentRequestSource::QUALIFIED_IN_POOL, $selected, true);
        $matchesAtLevel = in_array(TalentRequestSource::AT_LEVEL, $selected, true)
            && (! $matchesQualifiedInPool || $this->faker->boolean());
        $matchesAdvancement = in_array(TalentRequestSource::ADVANCEMENT, $selected, true)
            && (! ($matchesQualifiedInPool || $matchesAtLevel) || $this->faker->boolean());
        $matchesLateralMovement = in_array(TalentRequestSource::LATERAL_MOVEMENT, $selected, true)
            && (! ($matchesQualifiedInPool || $matchesAtLevel || $matchesAdvancement) || $this->faker->boolean());

        return array_values(array_filter([
            $matchesQualifiedInPool ? TalentRequestSource::QUALIFIED_IN_POOL : null,
            $matchesAtLevel ? TalentRequestSource::AT_LEVEL : null,
            $matchesAdvancement ? TalentRequestSource::ADVANCEMENT : null,
            $matchesLateralMovement ? TalentRequestSource::LATERAL_MOVEMENT : null,
        ]));
    }

    private function createUser(ApplicantFilter $filter, ?array $sources = null): User
    {
        $sources ??= $this->randomSources($filter);

        $matchesQualifiedInPool = in_array(TalentRequestSource::QUALIFIED_IN_POOL, $sources, true);
        $matchesAtLevel = in_array(TalentRequestSource::AT_LEVEL, $sources, true);
        $matchesAdvancement = in_array(TalentRequestSource::ADVANCEMENT, $sources, true);
        $matchesLateralMovement = in_array(TalentRequestSource::LATERAL_MOVEMENT, $sources, true);
        $matchesNomination = $matchesAdvancement || $matchesLateralMovement;

        $user = User::factory()
            ->when($matchesNomination, fn ($factory) => $factory->asApplicant()->withGovEmployeeProfile())
            ->create($this->matchingUserAttributes($filter));

        if ($matchesQualifiedInPool) {
            $pool = $filter->pools->isNotEmpty()
                ? $filter->pools->shuffle()->first()
                : $this->newMatchingPool($filter);

            PoolCandidate::factory()
                ->availableInSearch()
                ->for($pool)
                ->for($user)
                ->createQuietly();
        }

        if ($matchesAtLevel) {
            $classification = $filter->qualifiedInClassifications->shuffle()->first();
            if ($classification) {
                WorkExperience::factory()->asSubstantive()->create([
                    'user_id' => $user->id,
                    'classification_id' => $classification->id,
                ]);
            }
        }

        if ($matchesAtLevel || $matchesNomination) {
            $communityInterest = CommunityInterest::factory()->create([
                'user_id' => $user->id,
                'community_id' => $filter->community_id,
                'consent_to_share_profile' => true,
            ]);

            $workStream = $filter->qualifiedInWorkStreams->shuffle()->first();
            if ($workStream) {
                $communityInterest->workStreams()->attach($workStream->id);
            }
        }

        if ($matchesNomination) {
            $this->nominate($user, $filter, $matchesAdvancement, $matchesLateralMovement);
        }

        $skills = $filter->skills;
        if ($skills->isNotEmpty()) {
            $skills->shuffle()
                ->take($this->faker->numberBetween(1, $skills->count()))
                ->each(fn ($skill) => UserSkill::firstOrCreate(
                    ['user_id' => $user->id, 'skill_id' => $skill->id],
                    [
                        'skill_level' => $this->faker->enum(SkillLevel::class),
                        'when_skill_used' => $this->faker->enum(WhenSkillUsed::class),
                    ]
                ));
        }

        return $user;
    }

    public function withNominee(User $user, bool $forAdvancement = true, bool $forLateralMovement = true): self
    {
        return $this->afterCreating(function (TalentRequest $talentRequest) use ($user, $forAdvancement, $forLateralMovement) {
            $this->nominate($user, $talentRequest->applicantFilter, $forAdvancement, $forLateralMovement);

            TalentRequestTrackedUser::factory()
                ->for($talentRequest)
                ->create(['user_id' => $user->id]);
        });
    }

    private function nominate(User $user, ApplicantFilter $filter, bool $forAdvancement, bool $forLateralMovement): void
    {
        $event = TalentNominationEvent::where('community_id', $filter->community_id)
            ->where('open_date', '<=', now())
            ->whereDoesntHave('talentNominationGroups', fn ($query) => $query->where('nominee_id', $user->id))
            ->inRandomOrder()
            ->firstOr(fn () => TalentNominationEvent::factory()->create([
                'community_id' => $filter->community_id,
                'open_date' => now()->subMonth(),
                'close_date' => now()->addYear(),
            ]));

        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'talent_nomination_event_id' => $event->id,
                'nominee_id' => $user->id,
                'nominate_for_advancement' => $forAdvancement,
                'nominate_for_lateral_movement' => $forLateralMovement,
                'nominate_for_development_programs' => false,
            ]);

        $group = $nomination->talentNominationGroup;
        $classificationIds = ($filter->qualifiedInClassifications->isNotEmpty()
            ? $filter->qualifiedInClassifications
            : Classification::inRandomOrder()->limit($this->faker->numberBetween(1, 3))->get())
            ->pluck('id');

        $itOne = Classification::where('group', 'IT')->where('level', 1)->first();
        $classifications = $itOne
            ? $classificationIds->push($itOne->id)->unique()->values()
            : $classificationIds;

        if ($forAdvancement) {
            $group->advancement_decision = TalentNominationGroupDecision::APPROVED->name;
            $group->advancement_reference_confirmed = $this->faker->boolean();
            $group->advancement_notes = $this->faker->sentence();
            $group->advancement_referral_expiry_date = $this->faker->dateTimeBetween('+6 month', '+12 month');
            $group->advancementClassifications()->sync($classifications);
        }

        if ($forLateralMovement) {
            $group->lateral_movement_decision = TalentNominationGroupDecision::APPROVED->name;
            $group->lateral_movement_notes = $this->faker->sentence();
            $group->lateral_movement_referral_expiry_date = $this->faker->dateTimeBetween('+6 month', '+12 month');
            $group->lateralMovementClassifications()->sync($classifications);
        }

        $group->save();
    }

    /**
     * Create a pool matching the filter's community, classification, and work stream constraints.
     */
    private function newMatchingPool(ApplicantFilter $filter): Pool
    {
        $pool = Pool::factory()->for($filter->community);

        if ($classification = $filter->qualifiedInClassifications->shuffle()->first()) {
            $pool = $pool->for($classification);
        }

        if ($workStream = $filter->qualifiedInWorkStreams->shuffle()->first()) {
            $pool = $pool->for($workStream);
        }

        return $pool->create();
    }

    /**
     * Build User attributes that satisfy the scalar/equity/language scopes of an ApplicantFilter.
     *
     * @return array<string, mixed>
     */
    private function matchingUserAttributes(ApplicantFilter $filter): array
    {
        // whereEquityIn is an OR match - the user only needs one of the requested attributes.
        // Pick a random non-empty subset per user for a spread of equity coverage.
        $requestedEquity = array_keys(array_filter([
            'is_woman' => $filter->is_woman,
            'has_disability' => $filter->has_disability,
            'is_visible_minority' => $filter->is_visible_minority,
            'is_indigenous' => $filter->is_indigenous,
        ]));
        $chosenEquity = empty($requestedEquity)
            ? []
            : (array) $this->faker->randomElements($requestedEquity, $this->faker->numberBetween(1, count($requestedEquity)));

        return [
            'has_diploma' => $filter->has_diploma ?: $this->faker->boolean(),

            // equity (OR match)
            'is_woman' => in_array('is_woman', $chosenEquity),
            'has_disability' => in_array('has_disability', $chosenEquity),
            'is_visible_minority' => in_array('is_visible_minority', $chosenEquity),
            'indigenous_communities' => in_array('is_indigenous', $chosenEquity)
                ? [$this->faker->randomElement(IndigenousCommunity::cases())->name]
                : [],

            // language ability
            'looking_for_english' => $filter->language_ability === LanguageAbility::ENGLISH->name,
            'looking_for_french' => $filter->language_ability === LanguageAbility::FRENCH->name,
            'looking_for_bilingual' => $filter->language_ability === LanguageAbility::BILINGUAL->name,

            // operational requirements (AND match) - must contain all requested
            'accepted_operational_requirements' => $filter->operational_requirements ?? [],

            // position duration (OR match)
            'position_duration' => $filter->position_duration ?: [PositionDuration::PERMANENT->name],

            // location (special matching) - mirror the filter so the sets overlap
            'location_preferences' => $filter->location_preferences ?? [],
            'flexible_work_locations' => $filter->flexible_work_locations ?? [],
        ];
    }
}
