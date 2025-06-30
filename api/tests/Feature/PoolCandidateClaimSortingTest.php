<?php

namespace Tests\Feature;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Facades\Notify;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateClaimSortingTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    const QUERY =
        /** @lang GraphQL */
        '
    query PoolCandidatesPaginatedAdminView($orderByClaimVerification: ClaimVerificationSort) {
        poolCandidatesPaginatedAdminView(orderByClaimVerification: $orderByClaimVerification) {
            data {
                id
            }
        }
    }
';

    // the user to issue graphql queries
    protected $adminUser;

    // all the test candidates that we'll be sorting
    protected $bookmarkedAcceptedPriority;

    protected $bookmarkedNoClaims;

    protected $unverifiedPriorityAndAcceptedVeteran;

    protected $acceptedVeteran;

    protected $citizenOnly;

    protected $rejectedVeteranCitizenOther;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $pool = Pool::factory()->published()->create();
        $candidateSubmitDate = Carbon::parse(config('constants.past_datetime'));
        $this->bookmarkedAcceptedPriority = PoolCandidate::factory()
            ->for($pool)
            ->for(User::factory()->create([
                'has_priority_entitlement' => true,
                'armed_forces_status' => null,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]))
            ->make([
                'is_bookmarked' => true,
                'priority_verification' => ClaimVerificationResult::ACCEPTED->name,
                'veteran_verification' => null,
                'submitted_at' => $candidateSubmitDate,
            ]);

        $this->bookmarkedNoClaims = PoolCandidate::factory()
            ->for($pool)
            ->for(User::factory()->create([
                'has_priority_entitlement' => null,
                'armed_forces_status' => null,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]))
            ->make([
                'is_bookmarked' => true,
                'priority_verification' => null,
                'veteran_verification' => null,
                'submitted_at' => $candidateSubmitDate,
            ]);

        $this->unverifiedPriorityAndAcceptedVeteran = PoolCandidate::factory()
            ->for($pool)
            ->for(User::factory()->create([
                'has_priority_entitlement' => true,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]))
            ->make([
                'is_bookmarked' => false,
                'priority_verification' => ClaimVerificationResult::UNVERIFIED->name,
                'veteran_verification' => ClaimVerificationResult::ACCEPTED->name,
                'submitted_at' => $candidateSubmitDate,
            ]);

        $this->acceptedVeteran = PoolCandidate::factory()
            ->for($pool)
            ->for(User::factory()->create([
                'has_priority_entitlement' => null,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]))
            ->make([
                'is_bookmarked' => false,
                'priority_verification' => null,
                'veteran_verification' => ClaimVerificationResult::ACCEPTED->name,
                'submitted_at' => $candidateSubmitDate,
            ]);

        $this->rejectedVeteranCitizenOther = PoolCandidate::factory()
            ->for($pool)
            ->for(User::factory()->create([
                'has_priority_entitlement' => null,
                'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
                'citizenship' => CitizenshipStatus::OTHER->name,
            ]))
            ->make([
                'is_bookmarked' => false,
                'priority_verification' => null,
                'veteran_verification' => ClaimVerificationResult::REJECTED->name,
                'submitted_at' => $candidateSubmitDate,
            ]);

        $this->citizenOnly = PoolCandidate::factory()
            ->for($pool)
            ->for(User::factory()->create([
                'has_priority_entitlement' => null,
                'armed_forces_status' => null,
                'citizenship' => CitizenshipStatus::CITIZEN->name,
            ]))
            ->make([
                'is_bookmarked' => false,
                'priority_verification' => null,
                'veteran_verification' => null,
                'submitted_at' => $candidateSubmitDate,
            ]);
    }

    // assert sorting by bookmarked then DESCENDING category
    public function testOrderDescByClaimVerification(): void
    {
        // save the candidates that we'll be sorting
        $this->bookmarkedAcceptedPriority->save();
        $this->bookmarkedNoClaims->save();
        $this->unverifiedPriorityAndAcceptedVeteran->save();
        $this->acceptedVeteran->save();
        $this->citizenOnly->save();
        $this->rejectedVeteranCitizenOther->save();

        // assert that veteran + priority treated as priority
        // priority > bookmarked > veteran > citizen/permanent resident > rest
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(self::QUERY, [
                'orderByClaimVerification' => [
                    'order' => 'DESC',
                    'useBookmark' => true,
                ],
            ])
            ->assertExactJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            [
                                'id' => $this->bookmarkedAcceptedPriority->id,
                            ],
                            [
                                'id' => $this->bookmarkedNoClaims->id,
                            ],
                            [
                                'id' => $this->unverifiedPriorityAndAcceptedVeteran->id,
                            ],
                            [
                                'id' => $this->acceptedVeteran->id,
                            ],
                            [
                                'id' => $this->citizenOnly->id,
                            ],
                            [
                                'id' => $this->rejectedVeteranCitizenOther->id,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    // assert sorting by bookmarked then ASCENDING category
    public function testOrderAscByClaimVerification(): void
    {
        // save the candidates that we'll be sorting
        $this->bookmarkedAcceptedPriority->save();
        $this->bookmarkedNoClaims->save();
        $this->unverifiedPriorityAndAcceptedVeteran->save();
        $this->acceptedVeteran->save();
        $this->citizenOnly->save();
        $this->rejectedVeteranCitizenOther->save();

        // assert sorting by bookmarked first but then ASCENDING category
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(self::QUERY, [
                'orderByClaimVerification' => [
                    'order' => 'ASC',
                    'useBookmark' => true,
                ],
            ])
            ->assertExactJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            [
                                'id' => $this->bookmarkedNoClaims->id,
                            ],
                            [
                                'id' => $this->bookmarkedAcceptedPriority->id,
                            ],
                            [
                                'id' => $this->rejectedVeteranCitizenOther->id,
                            ],
                            [
                                'id' => $this->citizenOnly->id,
                            ],
                            [
                                'id' => $this->acceptedVeteran->id,
                            ],
                            [
                                'id' => $this->unverifiedPriorityAndAcceptedVeteran->id,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    // assert sorting by DESCENDING category (NOT by bookmarked)
    public function testOrderDescBookmarkByClaimVerification(): void
    {
        // excluding bookmarked candidates since they have ambiguous ordering without that query option
        // $this->bookmarkedAcceptedPriority->save();
        // $this->bookmarkedNoClaims->save();

        // save the candidates that we'll be sorting
        $this->unverifiedPriorityAndAcceptedVeteran->save();
        $this->acceptedVeteran->save();
        $this->citizenOnly->save();
        $this->rejectedVeteranCitizenOther->save();

        // assert sorting by DESCENDING category (without bookmarked)
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(self::QUERY, [
                'orderByClaimVerification' => [
                    'order' => 'DESC',
                    // not setting the useBookmark option
                ],
            ])
            ->assertExactJson([
                'data' => [
                    'poolCandidatesPaginatedAdminView' => [
                        'data' => [
                            // has same ordering value as unverifiedPriorityAndAcceptedVeteran
                            // [
                            //     'id' => $this->bookmarkedAcceptedPriority->id,
                            // ],
                            [
                                'id' => $this->unverifiedPriorityAndAcceptedVeteran->id,
                            ],
                            [
                                'id' => $this->acceptedVeteran->id,
                            ],
                            [
                                'id' => $this->citizenOnly->id,
                            ],
                            // has same ordering value as citizenOnly
                            // [
                            //     'id' => $this->bookmarkedNoClaims->id,
                            // ],
                            [
                                'id' => $this->rejectedVeteranCitizenOther->id,
                            ],
                        ],
                    ],
                ],
            ]);
    }
}
