<?php

namespace Database\Seeders;

use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\DisqualificationReason;
use App\Enums\PlacementType;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

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
        PoolCandidate::factory()->qualified()->create([
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
                    state: 'placed',
                    stateArgs: [PlacementType::PLACED_INDETERMINATE],
                    atts: [
                        'expiry_date' => now()->addYears(2),
                        'priority_verification' => ClaimVerificationResult::ACCEPTED->name,
                        'priority_verification_expiry' => now()->addYears(2),
                        'placed_at' => now()->subDays(2),
                    ]
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
                    state: 'qualified',
                    atts: [
                        'expiry_date' => now()->addYears(2),
                        'veteran_verification' => ClaimVerificationResult::UNVERIFIED->name,
                    ],
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
                    state: 'placed',
                    stateArgs: [PlacementType::PLACED_TENTATIVE],
                    atts: [
                        'expiry_date' => now()->addYears(2),
                        'veteran_verification' => ClaimVerificationResult::REJECTED->name,
                    ],
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
                    state: 'removed',
                    stateArgs: [CandidateRemovalReason::NOT_RESPONSIVE],
                    atts: [
                        'expiry_date' => now()->addYears(2),
                    ],
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
                    state: 'disqualified',
                    stateArgs: [DisqualificationReason::SCREENED_OUT_APPLICATION],
                    atts: [
                        'expiry_date' => now()->addYears(2),
                    ],
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
                    state: 'removed',
                    stateArgs: [CandidateRemovalReason::OTHER],
                    atts: [
                        'expiry_date' => now()->addYears(2),
                    ],
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
                    state: 'qualified',
                    atts: [
                        'expiry_date' => now()->addYears(2),
                    ],
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
                    state: 'disqualified',
                    stateArgs: [DisqualificationReason::SCREENED_OUT_ASSESSMENT],
                    atts: [
                        'priority_verification' => ClaimVerificationResult::UNVERIFIED->name,
                        'expiry_date' => now()->addYears(2),
                    ],
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
        User $user,
        string $state,
        ?array $stateArgs = [],
        ?array $atts = []
    ) {
        foreach ($this->publishedPools as $pool) {
            $factory = PoolCandidate::factory()
                ->for($user)
                ->for($pool);

            if (method_exists($factory, $state)) {
                $factory = $factory->$state(...$stateArgs);
            } else {
                Log::warning("Factory state {$state} does not exist.");
            }

            $factory->create($atts ?? []);
        }
    }
}
