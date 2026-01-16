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
use App\Enums\SkillLevel;
use App\Models\AssessmentStep;
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
            'contact_email' => $this->faker->email(),
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
        ]);
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

    public function withPoolSkills($essentialCount, $nonEssentialCount)
    {
        return $this->afterCreating(function (Pool $pool) use ($essentialCount, $nonEssentialCount) {
            $skills = Skill::inRandomOrder()->limit(10)->get();
            // slice first set of skills as essential skills
            $essentialSkills = $skills->slice(0, $essentialCount);
            // slice next set of  skills as non essential skills
            $nonEssentialSkills = $skills->slice($essentialCount, $nonEssentialCount);
            $this->createPoolSkills($pool, $essentialSkills, PoolSkillType::ESSENTIAL->name);
            $this->createPoolSkills($pool, $nonEssentialSkills, PoolSkillType::NONESSENTIAL->name);
        });
    }

    private function createPoolSkills($pool, $skills, $type)
    {
        // for each skills create it as pool skill
        foreach ($skills as $skill) {
            $pool->poolSkills()->create([
                'skill_id' => $skill->id,
                'type' => $type,
                'required_skill_level' => $this->faker->randomElement(array_column(SkillLevel::cases(), 'name')),
            ]);
        }
    }

    public function withQuestions($generalQuestionsCount, $screeningQuestionsCount)
    {
        return $this->afterCreating(function (Pool $pool) use ($generalQuestionsCount, $screeningQuestionsCount) {
            $this->createQuestions(GeneralQuestion::class, $generalQuestionsCount, $pool->id);
            $this->createQuestions(ScreeningQuestion::class, $screeningQuestionsCount, $pool->id, $this->createAssessmentStepWithPoolSkills($pool, AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name)->id);
        });
    }

    private function createAssessmentStep($pool, $type, $sortOrder = 1)
    {
        return AssessmentStep::factory()
            ->create([
                'pool_id' => $pool->id,
                'type' => $type,
                'sort_order' => $sortOrder,
            ]);
    }

    private function createAssessmentStepWithPoolSkills($pool, $type, $stepNumber = 1)
    {
        $step = $this->createAssessmentStep($pool, $type, $stepNumber);
        $poolSkillArray = $pool->poolSkills->pluck('id')->toArray();
        $step->poolSkills()->sync($poolSkillArray);

        return $step;
    }

    public function withAssessmentStepAndWithoutPoolSkills()
    {
        return $this->afterCreating(function (Pool $pool) {
            $step = $this->createAssessmentStep($pool, AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name);

            return $step;
        });
    }

    private function createQuestions($factory, $count, $poolId, $assessmentStepId = null)
    {
        $sequence = [];
        for ($i = 1; $i <= $count; $i++) {
            $sequence[] = ['sort_order' => $i];
        }
        if ($assessmentStepId !== null) {
            $factory::factory()
                ->count($count)
                ->sequence(...$sequence)
                ->create([
                    'pool_id' => $poolId,
                    'assessment_step_id' => $assessmentStepId,
                ]);
        } else {
            $factory::factory()
                ->count($count)
                ->sequence(...$sequence)
                ->create([
                    'pool_id' => $poolId,
                ]);
        }
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
        return $this->published()->state(function () {
            return [
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ];
        });
    }

    /** Add assessment steps to the pool with pool skills for a complete assessment plan
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withAssessments($noOfAssessmentSteps = 2)
    {
        return $this->afterCreating(function (Pool $pool) use ($noOfAssessmentSteps) {
            $steps = [];

            // Only select from steps that do not appear in the first two positions
            // First position created automatically, second step should be created via `withQuestions`
            $availableTypes = AssessmentStepType::uncontrolledStepTypes();

            for ($i = 0; $i < $noOfAssessmentSteps - 1; $i++) {
                $steps[$i] = $this->createAssessmentStepWithPoolSkills($pool, $this->faker->randomElement($availableTypes)->name, $i + 3); // 1 and 2 are reserved so start at 3
            }
        });
    }

    // Add a single assessment step to the pool for the given assessment step type
    public function WithAssessmentStep(AssessmentStepType $type)
    {
        return $this->afterCreating(function (Pool $pool) use ($type) {

            $step = $this->createAssessmentStep($pool, $type->name);
            $poolSkillArray = $pool->poolSkills()->pluck('id')->toArray();
            $step->poolSkills()->sync($poolSkillArray);

            return $step;
        });
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

    // Add a pool bookmark attached to user
    public function withBookmark(string $user_id)
    {
        return $this->afterCreating(function (Pool $pool) use ($user_id) {
            $pool->poolBookmarks()->attach($user_id);

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
}
