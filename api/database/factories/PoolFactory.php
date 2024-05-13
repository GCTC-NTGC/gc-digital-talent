<?php

namespace Database\Factories;

use App\Enums\AssessmentStepType;
use App\Enums\PoolSkillType;
use App\Enums\PublishingGroup;
use App\Enums\SkillLevel;
use App\Models\AssessmentStep;
use App\Models\Classification;
use App\Models\GeneralQuestion;
use App\Models\Pool;
use App\Models\ScreeningQuestion;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

class PoolFactory extends Factory
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
        $adminUserId = User::whereHas('roles', function (Builder $query) {
            $query->where('name', 'platform_admin');
        })->limit(1)
            ->pluck('id')
            ->first();
        if (is_null($adminUserId)) {
            $adminUserId = User::factory()->asAdmin()->create()->id;
        }

        $teamId = Team::inRandomOrder()
            ->limit(1)
            ->pluck('id')
            ->first();
        if (is_null($teamId)) {
            $teamId = Team::factory()->create()->id;
        }

        $classification = Classification::inRandomOrder()->first();
        if (! $classification) {
            $classification = Classification::factory()->create();
        }

        $name = $this->faker->unique()->company();

        // this is essentially the draft state
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'user_id' => $adminUserId,
            'team_id' => $teamId,
            'classification_id' => $classification->id,
        ];
    }

    public function withPoolSkills($essentialCount, $nonEssentialCount)
    {
        return $this->afterCreating(function (Pool $pool) use ($essentialCount, $nonEssentialCount) {
            $this->$essentialCount = $essentialCount;
            $this->$nonEssentialCount = $nonEssentialCount;

            $skills = Skill::inRandomOrder()->limit(20)->get();
            $essentialSkills = $skills->random($essentialCount);
            $this->createPoolSkills($pool, $essentialSkills, PoolSkillType::ESSENTIAL->name);
            $nonEssentialSkills = $skills->diff($essentialSkills)->random($nonEssentialCount);
            $this->createPoolSkills($pool, $nonEssentialSkills, PoolSkillType::NONESSENTIAL->name);
        });
    }

    public function createPoolSkills($pool, $skills, $type)
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

    public function createAssessmentStep($pool, $type)
    {
        return AssessmentStep::factory()
            ->create([
                'pool_id' => $pool->id,
                'type' => $type,
            ]);
    }

    public function createAssessmentStepWithPoolSkills($pool, $type)
    {
        $step = $this->createAssessmentStep($pool, $type);
        $poolSkillArray = $pool->poolSkills->pluck('id')->toArray();
        $step->poolSkills()->sync($poolSkillArray);

        return $step;
    }

    public function createQuestions($factory, $count, $poolId, $assessmentStepId = null)
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
        return $this->state(function () {
            return [
                'publishing_group' => $this->faker->randomElement([
                    PublishingGroup::IT_JOBS->name,
                    PublishingGroup::IT_JOBS_ONGOING->name,
                ]),
            ];
        });
    }

    /** Add assessment steps to the pool with pool skills for a complete assessment plan
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withAssessments($noOfAssessmentSteps)
    {
        return $this->afterCreating(function (Pool $pool, $noOfAssessmentSteps) {
            $this->createAssessmentStepWithPoolSkills($pool, AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name);
            for ($i = 0; $i < $noOfAssessmentSteps - 1; $i++) {
                $steps[$i] = $this->createAssessmentStepWithPoolSkills($pool, $this->faker->randomElement(array_column(AssessmentStepType::cases(), 'name'))->name);
            }

        });
    }
}
