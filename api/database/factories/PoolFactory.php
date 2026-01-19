<?php

namespace Database\Factories;

use App\Enums\AssessmentStepType;
use App\Enums\OperationalRequirement;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\PoolOpportunityLength;
use App\Enums\PoolSelectionLimitation;
use App\Enums\PoolSkillType;
use App\Enums\PublishingGroup;
use App\Enums\SecurityStatus;
use App\Enums\SkillCategory;
use App\Enums\SkillLevel;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\GeneralQuestion;
use App\Models\Pool;
use App\Models\ScreeningQuestion;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkStream;

class PoolFactory extends BaseFactory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pool::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        $adminUserId = User::whereHas('roles', fn ($q) => $q->where('name', 'platform_admin'))->value('id');
        if (is_null($adminUserId)) {
            $adminUserId = User::factory()->asAdmin()->create()->id;
        }

        $classification = $this->firstOrCreate(Classification::class);
        $department = $this->firstOrCreate(Department::class);
        $community = $this->firstOrCreate(Community::class);

        $name = $this->faker->unique()->company();

        // this is essentially the draft state
        return [
            'name' => $this->localizedString($name),
            'user_id' => $adminUserId,
            'classification_id' => $classification->id,
            'department_id' => $department->id,
            'community_id' => $community->id,
        ];
    }

    /**
     * Indicate that the pool is draft.
     */
    public function draft(): self
    {
        return $this->state(function (array $attributes) {
            $hasSpecialNote = $this->faker->boolean();

            return [
                'published_at' => null,
                'process_number' => $this->faker->word(),
                'contact_email' => $this->faker->email(),
                'publishing_group' => $this->randomEnum(PublishingGroup::class),
                'opportunity_length' => $this->randomEnum(PoolOpportunityLength::class),
                'area_of_selection' => $this->randomEnum(PoolAreaOfSelection::class),
                'operational_requirements' => $this->randomEnum(OperationalRequirement::class, 2),
                'key_tasks' => $this->localizedString(null, 'paragraph', true),
                'your_impact' => $this->localizedString(null, 'paragraph', true),
                'what_to_expect' => $this->localizedString(null, 'paragraph', true),
                'what_to_expect_admission' => $this->localizedString(null, 'paragraph', true),
                'about_us' => $this->localizedString(null, 'paragraph', true),
                'special_note' => $hasSpecialNote ? $this->localizedString(null, 'paragraph', true) : null,
                'security_clearance' => $this->randomEnum(SecurityStatus::class),
                'advertisement_language' => $this->randomEnum(PoolLanguage::class),
                'is_remote' => $this->faker->boolean(),
                'advertisement_location' => function ($attributes) {
                    if ($attributes['is_remote']) {
                        return null;
                    }

                    return $this->localizedString(null, 'country');
                },
                'work_stream_id' => function ($attributes) {
                    $community = Community::find($attributes['community_id']);

                    return $community
                        ->workStreams()
                        ->inRandomOrder()
                        ->firstOr(fn () => WorkStream::factory()->for($community)->create())
                        ->id;
                },
                'selection_limitations' => function (array $attributes) {
                    $possibleLimitations = match ($attributes['area_of_selection']) {
                        PoolAreaOfSelection::EMPLOYEES->name => PoolSelectionLimitation::limitationsForEmployees(),
                        PoolAreaOfSelection::PUBLIC->name => PoolSelectionLimitation::limitationsForPublic(),
                        default => []
                    };

                    return $this->faker->randomElements(
                        array_column($possibleLimitations, 'name'),
                        $this->faker->numberBetween(0, count($possibleLimitations))
                    );
                },
            ];
        });
    }

    /**
     * Indicate that the pool is published.
     */
    public function published(): self
    {
        return $this->draft()->state([
            'published_at' => $this->faker->dateTimeBetween('-30 days', '-1 days'),
            'closing_date' => $this->faker->dateTimeBetween('+1 month', '+6 months'),
        ])->afterCreating(function (Pool $pool) {
            // Need one essential technical skill for accurate published pool
            $skill = Skill::where('category', SkillCategory::TECHNICAL->name)
                ->inRandomOrder()
                ->value('id');

            $pool->poolSkills()->create([
                'skill_id' => $skill,
                'type' => PoolSkillType::ESSENTIAL->name,
                'required_skill_level' => $this->randomEnum(SkillLevel::class),
            ]);
        });
    }

    /**
     * Indicate that the pool is closed.
     */
    public function closed(): self
    {
        return $this->published()->state([
            'published_at' => $this->faker->dateTimeBetween('-6 months', '-2 months'),
            'closing_date' => $this->faker->dateTimeBetween('-1 months', '-1 day'),
        ]);
    }

    /**
     * Indicate that the pool is archived.
     */
    public function archived(): self
    {
        return $this->closed()->state([
            'published_at' => $this->faker->dateTimeBetween('-12 months', '-6 months'),
            'closing_date' => $this->faker->dateTimeBetween('-6 months', '-2 months'),
            'archived_at' => $this->faker->dateTimeBetween('-1 month', '-1 day'),
        ]);
    }

    /**
     * Pool Candidates for this pool will appear in search results
     *
     * Note: That means only IT publishing groups
     *
     * @return void
     */
    public function candidatesAvailableInSearch()
    {
        return $this->published()->state([
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ]);
    }

    /**
     * Add a bookmark for a specific user
     *
     * @param  string  $userId  The user to attach the bookmark to
     * @return static
     */
    public function withBookmark(string $userId)
    {
        return $this->afterCreating(function (Pool $pool) use ($userId) {
            $pool->poolBookmarks()->attach($userId);

            return $pool;
        });
    }

    /**
     * Attach the users to the related pool.
     * Creates a new user if no userIds passed in.
     *
     * @param  array|null  $userIds  - Id of the users to attach the role to
     * @return void
     */
    public function withProcessOperators(?array $userIds = null)
    {
        return $this->afterCreating(function (Pool $pool) use ($userIds) {
            if (is_null($userIds) || count($userIds) === 0) {
                $pool->addProcessOperators(User::factory()->create()->id);
            } else {
                foreach ($userIds as $userId) {
                    $pool->addProcessOperators($userId);
                }
            }
        });
    }

    /**
     * Add essential and non-essential pool skills to the pool.
     *
     * @param  int|null  $essentialCount  How many essential skills to add (default: 1)
     * @param  int|null  $nonEssentialCount  How many non-essential skills to add (default: 1)
     * @return static
     */
    public function withPoolSkills(?int $essentialCount = 2, ?int $nonEssentialCount = 2): self
    {
        return $this->afterCreating(function (Pool $pool) use ($essentialCount, $nonEssentialCount) {
            $totalCount = $essentialCount + $nonEssentialCount;
            $skills = Skill::inRandomOrder()->limit($totalCount)->get()->values();

            foreach ($skills as $i => $skill) {
                $type = $i < $essentialCount
                    ? PoolSkillType::ESSENTIAL->name
                    : PoolSkillType::NONESSENTIAL->name;

                // Avoid duplicate
                $exists = $pool->poolSkills()
                    ->where('skill_id', $skill->id)
                    ->where('type', $type)
                    ->exists();

                if (! $exists) {
                    $pool->poolSkills()->create([
                        'skill_id' => $skill->id,
                        'type' => $type,
                        'required_skill_level' => $this->randomEnum(SkillLevel::class),
                    ]);
                }
            }
        });
    }

    /**
     * Add additional assessment steps to the pool.
     * Ensures every essential PoolSkill is linked to at least one step.
     *
     * @param  int  $count  Number of additional (not total) steps to create (default 1).
     * @param  array|null  $types  Optional array of types to cycle/choose from.
     * @param  bool  $assignSkills  If true (default), assign all essentials to at least one step
     * @return static
     */
    public function withAssessmentSteps(int $count = 1, ?array $types = null, bool $assignSkills = true): self
    {
        return $this->afterCreating(function (Pool $pool) use ($count, $types, $assignSkills) {
            // Define allowed types if not given
            $defaultTypes = AssessmentStepType::uncontrolledStepTypes();
            $allTypes = $types ?: $defaultTypes;

            $sortOrder = $pool->assessmentSteps()->max('sort_order') ?? 1;

            for ($i = 0; $i < $count; $i++) {
                $stepType = $this->faker->randomElement(
                    array_map(fn ($enum) => $enum->name, $allTypes)
                );
                $pool->assessmentSteps()->create([
                    'type' => $stepType,
                    'sort_order' => ++$sortOrder,
                    'title' => $this->localizedString(),
                ]);
            }

            // Assign skills only if $assignSkills === true and there is more than one step
            if ($assignSkills) {
                $this->ensureEssentialSkillsAssigned($pool);
            }
        });
    }

    /**
     * Add screening questions to the pool.
     *
     * Creates the specified number of ScreeningQuestion records associated with the given pool.
     * Each screening question is assigned a sequential sort order starting from 1.
     * Screening questions are associated with the second assessment step.
     *
     * @param  int  $count  Number of screening questions to add (default: 2)
     * @return static
     *
     * @see createQuestions() Uses internal helper to perform batch creation and sort order assignment.
     */
    public function withScreeningQuestions(int $count = 2): self
    {
        return $this->afterCreating(function (Pool $pool) use ($count) {
            $screeningStep = $pool->assessmentSteps()
                ->where('type', AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name)
                ->first();

            // If not found, create it (sort_order handled by boot)
            if (! $screeningStep) {
                $screeningStep = $pool->assessmentSteps()->create([
                    'type' => AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name,
                    'title' => $this->localizedString(),
                ]);
            }

            $this->createQuestions(
                ScreeningQuestion::class,
                $count,
                $pool->id,
                $screeningStep->id
            );
        });
    }

    /**
     * Add general questions to the pool.
     *
     * Creates the specified number of GeneralQuestion records associated with the given pool.
     * Each general question is assigned a sequential sort order starting from 1.
     * General questions are not associated with any assessment step.
     *
     * @param  int  $count  Number of general questions to add (default: 2)
     * @return static
     *
     * @see createQuestions() Uses internal helper to perform batch creation and sort order assignment.
     */
    public function withGeneralQuestions(int $count = 2): self
    {
        return $this->afterCreating(function (Pool $pool) use ($count) {
            $this->createQuestions(GeneralQuestion::class, $count, $pool->id);
        });
    }

    /**
     * Helper for creating questions with per-question sort_order.
     *
     * @param  class-string  $factory  Model factory (GeneralQuestion or ScreeningQuestion)
     * @param  int  $count  Number to create
     * @param  int  $poolId
     * @param  int|null  $assessmentStepId
     */
    private function createQuestions($factory, $count, $poolId, $assessmentStepId = null)
    {
        $sequence = [];
        for ($i = 1; $i <= $count; $i++) {
            $sequence[] = ['sort_order' => $i];
        }
        $attributes = ['pool_id' => $poolId];
        if ($assessmentStepId !== null) {
            $attributes['assessment_step_id'] = $assessmentStepId;
        }
        $factory::factory()
            ->count($count)
            ->sequence(...$sequence)
            ->create($attributes);
    }

    /**
     * Ensure assessment steps have assigned skills
     *
     * @param  Pool  $pool  The pool being created
     */
    private function ensureEssentialSkillsAssigned(Pool $pool): void
    {
        if ($pool->assessmentSteps()->count() <= 1) {
            return;
        }

        $steps = $pool->assessmentSteps()->with('poolSkills')->get();

        $essentialSkillIds = $pool->poolSkills()
            ->where('type', PoolSkillType::ESSENTIAL->name)
            ->pluck('id');

        foreach ($essentialSkillIds as $skillId) {
            $alreadyAssigned = $steps->contains(
                fn ($step) => $step->poolSkills->contains('id', $skillId)
            );

            if (! $alreadyAssigned) {
                $steps->random()->poolSkills()->attach($skillId);
            }
        }
    }

    /**
     * Create a new pool or get an existing pool based on the given attributes.
     *
     * @param  array  $attributes  The attributes of the pool.
     * @return Pool The created or existing pool.
     */
    public function createOrGetExisting($attributes = [])
    {
        $pool = Pool::where('name->en', $attributes['name']['en'])
            ->where('name->fr', $attributes['name']['fr'])
            ->first();

        if ($pool) {
            return $pool;
        }

        return $this->create($attributes);
    }
}
