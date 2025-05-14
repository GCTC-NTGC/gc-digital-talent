<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
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
     * User/PoolCandidate/Pool/AssessmentResult(future)
     *
     * @return void
     */
    public function run()
    {
        // constant values for reuse and setup
        $digitalCommunityId = Community::select('id')->where('key', 'digital')->sole()->id;
        $atipCommunityId = Community::select('id')->where('key', 'atip')->sole()->id;
        $financeCommunityId = Community::select('id')->where('key', 'finance')->sole()->id;

        $pools = Pool::factory()
            ->count(2)
            ->withPoolSkills(4, 4)
            ->withQuestions(2, 2)
            ->published()
            ->withAssessments(3)
            ->create();
        $poolIds = $pools->pluck('id')->toArray();

        // User - non-government
        for ($i = 0; $i < 10; $i++) {
            User::factory()
                ->asApplicant()
                ->withSkillsAndExperiences()
                ->afterCreating(function (User $user) use ($poolIds) {
                    $this->applyToPools($user, $poolIds);
                })
                ->count(100)
                ->create();
        }

        // User - government
        for ($i = 0; $i < 10; $i++) {
            User::factory()
                ->asApplicant()
                ->withSkillsAndExperiences()
                ->asGovEmployee()
                ->withEmployeeProfile()
                ->withCommunityInterests([
                    array_rand(array_flip([$digitalCommunityId, $atipCommunityId, $financeCommunityId])),
                ])
                ->afterCreating(function (User $user) use ($poolIds) {
                    $this->applyToPools($user, $poolIds);
                })
                ->count(100)
                ->create();
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
