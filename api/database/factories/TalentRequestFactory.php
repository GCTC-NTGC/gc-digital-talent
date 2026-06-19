<?php

namespace Database\Factories;

use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\PositionDuration;
use App\Enums\SkillLevel;
use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestPositionType;
use App\Enums\TalentRequestReason;
use App\Enums\TalentRequestStatus;
use App\Enums\WhenSkillUsed;
use App\Models\ApplicantFilter;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Models\UserSkill;

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
            'applicant_filter_id' => ApplicantFilter::factory()->create(['community_id' => $community->id])->id,
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

    /**
     * Attach tracked users, each backed by a qualified & available PoolCandidate
     * that satisfies the request's ApplicantFilter (i.e. would surface in a search).
     */
    public function withTrackedUsers(int $count = 3): self
    {
        return $this->afterCreating(function (TalentRequest $talentRequest) use ($count) {
            $filter = $talentRequest->applicantFilter;

            for ($i = 0; $i < $count; $i++) {
                $user = User::factory()->create($this->matchingUserAttributes($filter));

                $pool = Pool::factory()->candidatesAvailableInSearch()->create(array_filter([
                    'community_id' => $filter->community_id,
                    'classification_id' => $filter->qualifiedInClassifications->shuffle()->first()?->id,
                    'work_stream_id' => $filter->qualifiedInWorkStreams->shuffle()->first()?->id,
                ]));

                PoolCandidate::factory()
                    ->availableInSearch()
                    ->create([
                        'pool_id' => $pool->id,
                        'user_id' => $user->id,
                    ]);

                // whereSkillsAdditive is an OR match - only one filter skill is required.
                // Take a random non-empty subset per user for a spread of skill coverage.
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

                TalentRequestTrackedUser::factory()
                    ->withRandomState()
                    ->create([
                        'talent_request_id' => $talentRequest->id,
                        'user_id' => $user->id,
                    ]);

            }
        });
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
