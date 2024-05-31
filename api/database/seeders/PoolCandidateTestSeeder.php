<?php

namespace Database\Seeders;

use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\PoolCandidateStatus;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Seeder;

class PoolCandidateTestSeeder extends Seeder
{
    protected $publishedPools = [];

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
        $this->publishedPools = Pool::select('id', 'name')->whereNotNull('published_at')->get();

        // 1- Perfect Priority
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::QUALIFIED_AVAILABLE, now()->addYears(2));
            })
            ->create([
                'first_name' => 'Perfect',
                'last_name' => 'Priority',
                'email' => 'perfect@test.com',
                'sub' => 'perfect@test.com',
                'has_priority_entitlement' => true,
                'priority_number' => '123456789',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);

        //2- Barely qualified Veteran
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::QUALIFIED_AVAILABLE, now()->addYears(2));
            })
            ->create([
                'first_name' => 'Barely qualified',
                'last_name' => 'Veteran',
                'email' => 'veteran@test.com',
                'sub' => 'veteran@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            ]);

        // 3- Try-hard Not a veteran
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::PLACED_TENTATIVE, now()->addYears(2));
            })
            ->create([
                'first_name' => 'Try-hard',
                'last_name' => 'Not a veteran',
                'email' => 'try-hard@test.com',
                'sub' => 'try-hard@test.com',
                'citizenship' => CitizenshipStatus::PERMANENT_RESIDENT->name,
                'armed_forces_status' => null,
            ]);

        //4- Absent Canadian
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::REMOVED);
            })
            ->create([
                'first_name' => 'Absent',
                'last_name' => 'Canadian',
                'email' => 'absent@test.com',
                'sub' => 'absent@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);

        //5- Screened-out Non-Canadian
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::QUALIFIED_AVAILABLE, now()->addYears(2));
            })
            ->create([
                'first_name' => 'Screened-out',
                'last_name' => 'Non-Canadian',
                'email' => 'Screened-out@test.com',
                'sub' => 'Screened-out@test.com',
                'citizenship' => CitizenshipStatus::OTHER->name,
            ]);

        // 6- Failed Notes master
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::QUALIFIED_AVAILABLE, now()->addYears(2));
            })
            ->create([
                'first_name' => 'Failed',
                'last_name' => 'NotesMaster',
                'email' => 'Failed@test.com',
                'sub' => 'Failed@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);

        // 7- Barely qualified Holder
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::QUALIFIED_AVAILABLE, now()->addYears(2));
            })
            ->create([
                'first_name' => 'Barely',
                'last_name' => 'qualified Holder',
                'email' => 'barely@test.com',
                'sub' => 'barely@test.com',
                'citizenship' => CitizenshipStatus::PERMANENT_RESIDENT->name,
            ]);

        //8- Unsuccessful Priority
        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools($user, PoolCandidateStatus::SCREENED_OUT_ASSESSMENT);
            })
            ->create([
                'first_name' => 'Unsuccessful',
                'last_name' => 'Priority',
                'email' => 'Unsuccessful@test.com',
                'sub' => 'Unsuccessful@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);

    }

    private function applyToAllPools($user, $status, $expiryDate = null, $placedDepartmentId = null)
    {
        foreach ($this->publishedPools as $pool) {
            // create a pool candidate in the pool
            PoolCandidate::factory()->for($user)->for($pool)
                ->create([
                    'pool_id' => $pool->id,
                    'user_id' => $user->id,
                    'submitted_at' => config('constants.far_past_date'),
                    'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
                    'pool_candidate_status' => $status->name,
                    'expiry_date' => $expiryDate,
                    'placed_department_id' => $placedDepartmentId,
                ]);
        }
    }
}
