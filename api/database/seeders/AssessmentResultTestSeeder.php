<?php

namespace Database\Seeders;

use App\Enums\AssessmentResultType;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolCandidate;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;

class AssessmentResultTestSeeder extends Seeder
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
        $pool = Pool::select('id')->where('name->en', 'CMO Digital Careers')->sole();

        // specific pool
        $poolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
        ]);
        $dcmPoolSkills = $pool->poolSkills()->pluck('id')->toArray();
        $dcmAssessment1 = AssessmentStep::factory()->create([
            'pool_id' => $pool->id,
        ]);
        $dcmAssessment2 = AssessmentStep::factory()->create([
            'pool_id' => $pool->id,
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::EDUCATION)->create([
            'assessment_step_id' => $dcmAssessment1->id,
            'pool_candidate_id' => $poolCandidate->id,
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
            'assessment_step_id' => $dcmAssessment2->id,
            'pool_candidate_id' => $poolCandidate->id,
            'pool_skill_id' => $dcmPoolSkills[0],
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
            'assessment_step_id' => $dcmAssessment2->id,
            'pool_candidate_id' => $poolCandidate->id,
            'pool_skill_id' => $dcmPoolSkills[1],
        ]);
    }
}
