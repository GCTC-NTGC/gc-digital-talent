<?php

namespace Database\Seeders;

use App\Enums\AssessmentResultType;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\PoolCandidate;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;

class AssessmentResultRandomSeeder extends Seeder
{
    /**
     * The current Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;

    /**
     * Create a new seeder instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->faker = Container::getInstance()->make(Generator::class);
    }

    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {
        $assessmentSteps = AssessmentStep::inRandomOrder()->with('pool')->limit(10)->get();

        foreach ($assessmentSteps as $assessmentStep) {
            $poolSkillIds = $assessmentStep->pool->poolSkills()->pluck('id')->toArray();
            $poolCandidate =
                PoolCandidate::where('pool_id', $assessmentStep->pool_id)->first() ??
                PoolCandidate::factory()->createQuietly([
                    'pool_id' => $assessmentStep->pool_id,
                ]);

            AssessmentResult::factory()->withResultType(AssessmentResultType::EDUCATION)->createQuietly([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
            ]);
            AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->createQuietly([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
                'pool_skill_id' => count($poolSkillIds) > 0 ? $poolSkillIds[0] : null,
            ]);
            AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->createQuietly([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
                'pool_skill_id' => count($poolSkillIds) > 0 ? $poolSkillIds[1] : null,
            ]);
        }
    }
}
