<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\DisqualificationReason;
use App\Enums\PlacementType;
use App\Models\Department;
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
        PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::QUALIFIED->name,
            'submitted_at' => config('constants.far_past_date'),
            'expiry_date' => config('constants.far_future_date'),
            'pool_id' => Pool::select('id')->where('name->en', 'CMO Digital Careers')->sole()->id,
        ]);
        $this->publishedPools = Pool::select('id', 'name')->whereNotNull('published_at')->get();

        // 1 - Perfect Priority
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::QUALIFIED->name,
                    placementType: PlacementType::PLACED_INDETERMINATE->name,
                    expiryDate: now()->addYears(2),
                    priorityStatus: ClaimVerificationResult::ACCEPTED->name,
                    priorityExpiry: now()->addYears(2),
                    placedAt: now()->subDays(2),
                );
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

        // 2 - Entry-level Veteran
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::QUALIFIED->name,
                    expiryDate: now()->addYears(2),
                    veteranStatus: ClaimVerificationResult::UNVERIFIED->name,
                );
            })
            ->create([
                'first_name' => 'Entry-level',
                'last_name' => 'Veteran',
                'email' => 'veteran@test.com',
                'sub' => 'veteran@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            ]);

        // 3 - Assertive Non-veteran
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::QUALIFIED->name,
                    placementType: PlacementType::PLACED_TENTATIVE->name,
                    expiryDate: now()->addYears(2),
                    veteranStatus: ClaimVerificationResult::REJECTED->name,
                );
            })
            ->create([
                'first_name' => 'Assertive',
                'last_name' => 'Non-veteran',
                'email' => 'assertive@test.com',
                'sub' => 'assertive@test.com',
                'citizenship' => CitizenshipStatus::PERMANENT_RESIDENT->name,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            ]);

        // 4 - Absent Canadian
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::REMOVED->name,
                    removalReason: CandidateRemovalReason::NOT_RESPONSIVE->name,
                    expiryDate: now()->addYears(2),
                );
            })
            ->create([
                'first_name' => 'Absent',
                'last_name' => 'Canadian',
                'email' => 'absent@test.com',
                'sub' => 'absent@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);

        // 5 - Screened-out Non-Canadian
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::DISQUALIFIED->name,
                    disqualificationReason: DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                    expiryDate: now()->addYears(2),
                );
            })
            ->create([
                'first_name' => 'Screened-out',
                'last_name' => 'Non-Canadian',
                'email' => 'screened-out@test.com',
                'sub' => 'screened-out@test.com',
                'citizenship' => CitizenshipStatus::OTHER->name,
            ]);

        // 6 - Failed Notes Wizard
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::REMOVED->name,
                    removalReason: CandidateRemovalReason::OTHER->name,
                    expiryDate: now()->addYears(2),
                );
            })
            ->create([
                'first_name' => 'Failed',
                'last_name' => 'Notes Wizard',
                'email' => 'failed@test.com',
                'sub' => 'failed@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);

        // 7 - Entry-level Holder
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::QUALIFIED->name,
                    expiryDate: now()->addYears(2),
                );
            })
            ->create([
                'first_name' => 'Entry-level',
                'last_name' => 'Holder',
                'email' => 'entry-level-holder@test.com',
                'sub' => 'entry-level-holder@test.com',
                'citizenship' => CitizenshipStatus::PERMANENT_RESIDENT->name,
            ]);

        // 8 - Unsuccessful Priority
        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->afterCreating(function (User $user) {
                $this->applyToAllPools(
                    user: $user,
                    status: ApplicationStatus::DISQUALIFIED->name,
                    disqualificationReason: DisqualificationReason::SCREENED_OUT_ASSESSMENT->name,
                    priorityStatus: ClaimVerificationResult::UNVERIFIED->name,
                    expiryDate: now()->addYears(2),
                );
            })
            ->create([
                'first_name' => 'Unsuccessful',
                'last_name' => 'Priority',
                'email' => 'unsuccessful@test.com',
                'sub' => 'unsuccessful@test.com',
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]);
    }

    private function applyToAllPools(
        $user,
        $status,
        $removalReason = null,
        $disqualificationReason = null,
        $expiryDate = null,
        $priorityStatus = null,
        $priorityExpiry = null,
        $veteranStatus = null,
        $veteranExpiry = null,
        $placementType = null,
        $placedAt = null)
    {
        foreach ($this->publishedPools as $pool) {
            // create a pool candidate in the pool
            PoolCandidate::factory()->for($user)->for($pool)
                ->afterCreating(function (PoolCandidate $candidate) use ($removalReason, $placedAt, $priorityStatus, $priorityExpiry, $veteranStatus, $veteranExpiry) {
                    if ($removalReason == CandidateRemovalReason::OTHER->name) {
                        $candidate->removal_reason_other = 'Other reason';
                    } else {
                        $candidate->removal_reason_other = null;
                    }
                    $candidate->priority_verification = $priorityStatus;
                    $candidate->priority_verification_expiry = $priorityExpiry;
                    $candidate->veteran_verification = $veteranStatus;
                    $candidate->veteran_verification_expiry = $veteranExpiry;
                    $candidate->placed_department_id = isset($placedAt) ?
                        Department::inRandomOrder()->first()->id : null;

                    $candidate->save();
                    $candidate->setApplicationSnapshot();
                })
                ->create([
                    'pool_id' => $pool->id,
                    'user_id' => $user->id,
                    'submitted_at' => config('constants.far_past_date'),
                    'submitted_steps' => array_column(ApplicationStep::cases(), 'name'),
                    'application_status' => $status,
                    'removal_reason' => $removalReason,
                    'disqualification_reason' => $disqualificationReason,
                    'expiry_date' => $expiryDate,
                    'placed_at' => $placedAt,
                    'placement_type' => $placementType,
                ]);
        }
    }
}
