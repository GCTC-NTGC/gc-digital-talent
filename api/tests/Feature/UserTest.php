<?php

namespace Tests\Feature;

use App\Enums\CandidateExpiryFilter;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PoolCandidateStatus;
use App\Enums\PositionDuration;
use App\Enums\WorkRegion;
use App\Facades\Notify;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class UserTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->bootRefreshesSchemaCache();
        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin@test.com',
                'sub' => 'platform-admin@test.com',

                // The following properties make sure this user doesn't match certain test queries, skewing results.
                'looking_for_english' => null,
                'looking_for_french' => null,
                'looking_for_bilingual' => null,
                'accepted_operational_requirements' => null,
                'location_preferences' => [],
                'has_diploma' => false,
                'position_duration' => [],
                'is_gov_employee' => false,
                'telephone' => null,
                'first_name' => null,
                'last_name' => null,
            ]);
    }

    public function testCreateUserDefaultRoles()
    {
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang { value }
                    preferredLanguageForInterview { value }
                    preferredLanguageForExam { value }
                }
            }
        ',
            [
                'user' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    // If roles is not set, it should come back as empty array.
                ],
            ]
        )->assertJson([
            'data' => [
                'createUser' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'telephone' => null,
                    'preferredLang' => null,
                    'preferredLanguageForInterview' => null,
                    'preferredLanguageForExam' => null,
                ],
            ],
        ]);
        // Ensure user was saved
        $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
    }

    public function testCreateUserAdminRole()
    {
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang { value }
                    preferredLanguageForInterview { value }
                    preferredLanguageForExam { value }
                }
            }
        ',
            [
                'user' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                ],
            ]
        )->assertJson([
            'data' => [
                'createUser' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'telephone' => null,
                    'preferredLang' => null,
                    'preferredLanguageForInterview' => null,
                    'preferredLanguageForExam' => null,
                ],
            ],
        ]);
        // Ensure user was saved
        $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
    }

    public function testFilterByPoolCandidateStatuses(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id'],
        ]);
        $pool2 = Pool::factory()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::EXPIRED->name,
        ]);
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_TERM->name,
        ]);
        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => null,
        ]);
        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::REMOVED->name,
        ]);

        // Assert query with no pool filter will return all users, including unavailable
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 16,
                    ],
                ],
            ],
        ]);

        // Assert query with pool filter but no statuses filter
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13,
                    ],
                ],
            ],
        ]);

        // Assert query with pool filter, only expired status
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [PoolCandidateStatus::EXPIRED->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4,
                    ],
                ],
            ],
        ]);

        // Assert query with pool filter, only removed status
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [PoolCandidateStatus::REMOVED->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert query with pool filter, expired + removed + available statuses
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name, PoolCandidateStatus::EXPIRED->name, PoolCandidateStatus::REMOVED->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10,
                    ],
                ],
            ],
        ]);

        // Assert query with pool filter, empty array of statuses will return all candidates in pool.
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13,
                    ],
                ],
            ],
        ]);

        // Assert query with unknown pool filter will return zero
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => '00000000-0000-0000-0000-000000000000',
                            'statuses' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByCandidateExpiryDate(): void
    {
        // myPool will be people we're querying for and should be returned
        $myPool = Pool::factory()->create(['name' => [
            'en' => 'myPool',
            'fr' => 'myPool',
        ]]);
        // otherPool will be people we're not querying for and should not be returned
        $otherPool = Pool::factory()->create(['name' => [
            'en' => 'otherPool',
            'fr' => 'otherPool',
        ]]);

        // Create some valid users in myPool, AVAILABLE status to ensure filter by pool only changes off expiry date in this test
        PoolCandidate::factory()->count(4)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $myPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        // A candidate which expires today is not expired YET.
        PoolCandidate::factory()->create([
            'expiry_date' => date('Y-m-d'),
            'pool_id' => $myPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        // Candidates without expiry dates are considered active.
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => null,
            'pool_id' => $myPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        // Create some expired users in myPool
        PoolCandidate::factory()->count(2)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $myPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);

        // Create some valid users in otherPool
        PoolCandidate::factory()->count(5)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => date('Y-m-d'),
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => null,
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);
        // Create some expired users in otherPool
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
        ]);

        // Assert query with no parameters returns all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        '
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 21, // 1 user from the pool factories + 20 from the pool candidate factories
                    ],
                ],
            ],
        ]);

        // Assert query with pool and expiryStatus ACTIVE returns correct users
        $response = $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $myPool->id,
                            'expiryStatus' => CandidateExpiryFilter::ACTIVE->name,
                            'statuses' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
                        ],
                    ],
                ],
            ]
        );
        $response->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query for pool without setting expiryStatus returns ACTIVE users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $myPool->id,
                            'statuses' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query with pool and expiryStatus EXPIRED returns correct users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [

                            'poolId' => $myPool->id,
                            'expiryStatus' => CandidateExpiryFilter::EXPIRED->name,
                            'statuses' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with pool and expiryStatus ALL returns all users in pool
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $myPool->id,
                            'expiryStatus' => CandidateExpiryFilter::ALL->name,
                            'statuses' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
                        ],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByLanguageAbility(): void
    {
        User::factory()->count(1)->create([
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->count(4)->create([
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);

        // Create new LanguageAbility and attach to 3 new pool users.
        User::factory()->create([
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->create([
            'looking_for_english' => true,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->create([
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => true,
        ]);

        // Assert query with no LanguageAbility filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 9,
                    ],
                ],
            ],
        ]);

        // Assert query with ENGLISH filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'languageAbility' => 'ENGLISH',
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert query with FRENCH filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'languageAbility' => 'FRENCH',
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);

        // Assert query with BILINGUAL filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'languageAbility' => 'BILINGUAL',
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByOperationalRequirements(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'accepted_operational_requirements' => null,
        ]);
        $operationalRequirement1 = OperationalRequirement::OVERTIME_REGULAR->name;
        $operationalRequirement2 = OperationalRequirement::SHIFT_WORK->name;
        $operationalRequirement3 = OperationalRequirement::ON_CALL->name;

        // Create a few with a op_req 1
        User::factory()->count(2)->create([
            'accepted_operational_requirements' => [$operationalRequirement1],
        ]);

        // Create a few with op_req 1 and 2
        User::factory()->count(2)->create([
            'accepted_operational_requirements' => [$operationalRequirement1, $operationalRequirement2],
        ]);

        // Assert query with no operationalRequirements filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10,
                    ],
                ],
            ],
        ]);

        // Assert query with empty operationalRequirements filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10,
                    ],
                ],
            ],
        ]);

        // Assert query with one operationalRequirement filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [$operationalRequirement1],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4,
                    ],
                ],
            ],
        ]);

        // Assert query with two operationalRequirement filters will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [$operationalRequirement1, $operationalRequirement2],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with an unused operationalRequirement filter will return zero
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [$operationalRequirement3],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByLocationPreferences(): void
    {
        // Create 5 new users with a ONTARIO location preference.
        User::factory()->count(5)->create([
            'location_preferences' => [WorkRegion::ONTARIO->name],
        ]);

        // Create 2 new users with a TELEWORK location preference.
        User::factory()->count(2)->create([
            'location_preferences' => [WorkRegion::TELEWORK->name],
        ]);

        // Assert query with no locationPreferences filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query with locationPreferences filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'locationPreferences' => [WorkRegion::TELEWORK->name],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with empty locationPreferences filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'locationPreferences' => [],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByDiploma(): void
    {
        // Create initial set of 5 users with no diploma.
        User::factory()->count(5)->create([
            'has_diploma' => false,
        ]);

        // Create two new users with a diploma.
        User::factory()->count(2)->create([
            'has_diploma' => true,
        ]);

        // Assert query no hasDiploma filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query with hasDiploma filter set to true will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'hasDiploma' => true,
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with hasDiploma filter set to false will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'hasDiploma' => false,
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByAcceptTemporary(): void
    {
        // Create initial set of 5 users which wouldn't accept temporary.
        User::factory()->count(5)->create([
            'position_duration' => [PositionDuration::PERMANENT->name],
        ]);

        // Create two new users who would accept a temporary.
        User::factory()->count(2)->create([
            'position_duration' => array_column(PositionDuration::cases(), 'name'),
        ]);

        // Assert query no positionDuration filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);

        // Assert query with position duration filter set to temporary will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'positionDuration' => [PositionDuration::TEMPORARY->name],
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2,
                    ],
                ],
            ],
        ]);

        // Assert query with position duration filter set to null will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'positionDuration' => null,
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8,
                    ],
                ],
            ],
        ]);
    }

    public function testFilterByProfileComplete(): void
    {
        // need some generic job titles for a complete profile
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        // Create initial set of 5 users with incomplete profiles.
        User::factory()->count(5)->create([
            'current_province' => null,
            'location_preferences' => null,
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);

        // Create some partially complete users.
        User::factory()->count(2)->create([
            'current_province' => 'ONTARIO',
            'location_preferences' => null,
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->count(2)->create([
            'current_province' => 'ONTARIO',
            'location_preferences' => ['PRAIRIE'],
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);
        User::factory()->count(1)->create([
            'citizenship' => null,
            'armed_forces_status' => null,
        ]);

        // Create some complete users.
        User::factory()->count(3)
            ->create([
                'current_province' => 'ONTARIO',
                'location_preferences' => ['PRAIRIE'],
                'looking_for_english' => null,
                'looking_for_french' => true,
                'looking_for_bilingual' => null,
                'telephone' => '+15407608748',
                'current_city' => 'Somewhere random',
                'is_gov_employee' => false,
            ]);

        // Assert query no isProfileComplete filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14,
                    ],
                ],
            ],
        ]);

        // Assert query with isProfileComplete filter set to true will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isProfileComplete' => true,
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3,
                    ],
                ],
            ],
        ]);

        // Assert query with isProfileComplete filter set to false will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isProfileComplete' => false,
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14,
                    ],
                ],
            ],
        ]);
    }
}
