<?php

namespace Database\Seeders;

use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\PoolSkillType;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\User;
use Illuminate\Database\Seeder;

class BigSeederPoolCandidateUser extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeds a lot of data
     * Run this AFTER core data has been seeded, this will not seed platform data
     *
     * User/PoolCandidate/Pool/AssessmentResult
     *
     * @return void
     */
    public function run()
    {
        $input = $this->command->ask('Please enter how many times to loop');
        $limit = intval($input);
        $limit = (is_int($limit) && $limit > 0) ? $limit : 1;

        // constant values for reuse and setup
        $digitalCommunityId = Community::select('id')->where('key', 'digital')->sole()->id;
        $atipCommunityId = Community::select('id')->where('key', 'atip')->sole()->id;
        $financeCommunityId = Community::select('id')->where('key', 'finance')->sole()->id;

        $pools = Pool::factory()
            ->count(2)
            ->published()
            ->withPoolSkills(4, 4)
            ->withGeneralQuestions(2)
            ->withAssessmentSteps(count: 3, screeningQuestionCount: 3)
            ->create();
        $poolIds = $pools->pluck('id')->toArray();

        // User - non-government
        for ($i = 0; $i < $limit; $i++) {
            User::factory()
                ->asApplicant()
                ->withNonGovProfile()
                ->afterCreating(function (User $user) use ($poolIds) {
                    $this->applyToPools($user, $poolIds);
                })
                ->count(500)
                ->create();
        }

        // User - government
        for ($i = 0; $i < $limit; $i++) {
            User::factory()
                ->asApplicant()
                ->withGovEmployeeProfile()
                ->withCommunityInterests(
                    [$digitalCommunityId, $atipCommunityId, $financeCommunityId],
                )
                ->afterCreating(function (User $user) use ($poolIds) {
                    $this->applyToPools($user, $poolIds);
                })
                ->count(500)
                ->create();
        }

        // AssessmentResult - Pool one
        $poolOne = $poolIds[0];
        $assessmentSteps = AssessmentStep::where('pool_id', $poolOne)->get();
        $essentialPoolSkills = PoolSkill::where('pool_id', $poolOne)->where('type', PoolSkillType::ESSENTIAL->name)->get();
        $poolOneCandidatesToFillResults = PoolCandidate::where('pool_id', $poolOne)
            ->inRandomOrder()
            ->take(100)
            ->get();
        foreach ($poolOneCandidatesToFillResults as $poolOneCandidatesToFillResult) {
            foreach ($assessmentSteps as $assessmentStep) {
                if ($assessmentStep->type === AssessmentStepType::APPLICATION_SCREENING->name) {
                    AssessmentResult::factory()
                        ->withResultType(AssessmentResultType::EDUCATION)
                        ->create([
                            'assessment_step_id' => $assessmentStep->id,
                            'pool_candidate_id' => $poolOneCandidatesToFillResult->id,
                        ]);
                }

                foreach ($essentialPoolSkills as $essentialPoolSkill) {
                    AssessmentResult::factory()
                        ->withResultType(AssessmentResultType::SKILL)
                        ->create([
                            'assessment_step_id' => $assessmentStep->id,
                            'pool_candidate_id' => $poolOneCandidatesToFillResult->id,
                            'pool_skill_id' => $essentialPoolSkill->id,
                        ]);
                }
            }
        }
    }

    private function applyToPools(User $user, array $poolIds)
    {
        foreach ($poolIds as $poolId) {
            PoolCandidate::factory()
                ->withSnapshot()
                ->create([
                    'user_id' => $user->id,
                    'pool_id' => $poolId,
                ]);
        }
    }
}
