<?php

namespace Database\Seeders;

use App\Enums\ApplicationStep;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\Pool;
use Illuminate\Database\Seeder;

class PoolCandidateTestSeeder extends Seeder
{
    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {

        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'submitted_at' => config('constants.far_past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => Pool::select('id')->where('name->en', 'CMO Digital Careers')->sole()->id,
        ]);
        // set status to EXPIRED manually despite not being submitted
        // this was split into two steps as otherwise PoolCandidateFactory automatically assigns a submitted_at
        $candidateOne->pool_candidate_status = PoolCandidateStatus::EXPIRED->name;
        $candidateOne->save();
        $users=[];
        $users[0] = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create([
                'first_name' => 'User1',
                'last_name' => 'Test1',
                'email' => 'user1@test.com',
                'sub' => 'user1@test.com',
                'has_priority_entitlement' => true,
                'citizenship' => 'Canadian',
            ]);

        $users[1] =  User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create([
                'first_name' => 'User2',
                'last_name' => 'Test2',
                'email' => 'user2@test.com',
                'sub' => 'user2@test.com',
            ]);

       $users[2] = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'User3',
                'last_name' => 'Test3',
                'email' => 'user3@test.com',
                'sub' => 'user3@test.com',
            ]);

       $users[3] = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create([
                'first_name' => 'User4',
                'last_name' => 'Test4',
                'email' => 'user4@test.com',
                'sub' => 'test4@test.com',
            ]);

        $users[4] = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create([
                'first_name' => 'User5',
                'last_name' => 'Test5',
                'email' => 'user5@test.com',
                'sub' => 'user5@test.com',
            ]);

        $users[5] = User::factory()
            ->create([
                'first_name' => 'User6',
                'last_name' => 'Test6',
                'email' => 'user6@test.com',
                'sub' => 'user6@test.com',
            ]);
        $users[6] = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create([
                'first_name' => 'User7',
                'last_name' => 'Test7',
                'email' => 'user7@test.com',
                'sub' => 'user7@test.com',
            ]);
        $users[7] = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->create([
                'first_name' => 'User8',
                'last_name' => 'Test8',
                'email' => 'user8@test.com',
                'sub' => 'user8@test.com',
            ]);
    $this->applyToAllPools($users, Pool::all());
    }

    public function applyToAllPools($users, $pools)
    {
        foreach ($pools as $pool) {
            foreach ($users as $user) {
                $poolCandidate = PoolCandidate::factory()->create([
                    'pool_id' => $pool->id,
                    'user_id' => $user->id,
                    'submitted_at' => config('constants.far_past_date'),
                    'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
                ]);
                if ($user->first_name == 'User1' && $pool->name['en'] == 'IT Security Analyst') {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::PLACED_INDETERMINATE->name;
                    $poolCandidate->save();
                }
                if($user->first_name == 'User2')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
                if($user->first_name == 'User3')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::PLACED_TENTATIVE->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
                if($user->first_name == 'User3')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::PLACED_TENTATIVE->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
                if($user->first_name == 'User4')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::REMOVED->name;
                    $poolCandidate->save();
                }
             if($user->first_name == 'User5')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::SCREENED_OUT_APPLICATION->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
         if($user->first_name == 'User6')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::REMOVED->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
                 if($user->first_name == 'User7')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
                 if($user->first_name == 'User8')
                {
                    $poolCandidate->pool_candidate_status = PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name;
                    $poolCandidate->expiry_date = now()->addYears(2);
                    $poolCandidate->save();
                }
            }
        }
    }
}
