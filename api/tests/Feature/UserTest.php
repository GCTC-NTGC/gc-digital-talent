<?php

namespace Tests\Feature;

use App\Enums\CandidateExpiryFilter;
use App\Enums\EmploymentCategory;
use App\Enums\ErrorCode;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\LanguageAbility;
use App\Enums\OperationalRequirement;
use App\Enums\PoolCandidateStatus;
use App\Enums\PositionDuration;
use App\Enums\WorkRegion;
use App\Facades\Notify;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Role;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertSame;

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
                'computed_is_gov_employee' => false,
                'telephone' => null,
                'first_name' => null,
                'last_name' => null,
            ]);
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
            'flexible_work_locations' => [],
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);

        // Create some partially complete users.
        User::factory()->count(2)->create([
            'current_province' => 'ONTARIO',
            'location_preferences' => null,
            'flexible_work_locations' => [],
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->count(2)->create([
            'current_province' => 'ONTARIO',
            'flexible_work_locations' => [],
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
                'flexible_work_locations' => [FlexibleWorkLocation::HYBRID->name],
                'looking_for_english' => null,
                'looking_for_french' => true,
                'looking_for_bilingual' => null,
                'telephone' => '+15407608748',
                'current_city' => 'Somewhere random',
                'computed_is_gov_employee' => false,
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

    public function testFilterBySkillsIntersectional(): void
    {
        // Create initial data set
        Skill::factory()->count(20)->create();
        User::factory()->count(5)->create()->each(function ($user) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            EducationExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
        });

        // Create a skill to test for
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $skill3 = Skill::factory()->create();
        User::factory()->afterCreating(function ($user) use ($skill1) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
        })->create();
        User::factory()->afterCreating(function ($user) use ($skill1, $skill2) {
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill2) {
                    $model->syncSkills([$skill2]);
                })->create();
        })->create();

        // Assert query no skills filter will return all users
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

        // Assert query empty skills filter array will return all users
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
                        'skills' => [],
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

        // Assert query with one skills filter will return correct user count
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
                        'skillsIntersectional' => [
                            ['id' => $skill1['id']],
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

        // Assert query with two skills will return correct user count
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
                        'skillsIntersectional' => [
                            ['id' => $skill1['id']],
                            ['id' => $skill2['id']],
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

        // Assert query with unused skill will return correct user count
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
                        'skillsIntersectional' => [
                            ['id' => $skill3['id']],
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

    public function testFilterByGovEmployee(): void
    {
        // Create initial set of 5 users not with gov.
        User::factory()->count(5)->create([
            'computed_is_gov_employee' => false,
        ]);

        // Create two new users with the government.
        User::factory()->count(2)->create([
            'computed_is_gov_employee' => true,
        ]);

        // Assert query no isGovEmployee filter will return all users
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

        // Assert query with isGovEmployee filter set to true will return correct user count
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
                    'isGovEmployee' => true,
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

        // Assert query with isGovEmployee filter set to false will return all users
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
                    'isGovEmployee' => false,
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

    public function testOrdering(): void
    {
        // Create users for testing
        User::factory()->count(8)->create();
        $usersByName = User::select('id')->orderBy('first_name')->get()->toArray();
        $usersByCreated = User::select('id')->orderByDesc('created_at')->get()->toArray();

        // Assert query no orderBy given defaults to created_at desc
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    data {
                        id
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
                    'data' => $usersByCreated,
                ],
            ],
        ]);

        // Assert query orders by given attribute
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($orderBy: [OrderByClause!]) {
                usersPaginated(orderBy: $orderBy) {
                    data {
                        id
                    }
                }
            }
        ',
            [
                'orderBy' => [
                    [
                        'column' => 'first_name',
                        'order' => 'ASC',
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByName,
                ],
            ],
        ]);
    }

    public function testCountApplicantsQuery(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);
        $pool2 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id'],
        ]);

        PoolCandidate::factory()->count(8)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // Should appear in searches, but in pool 2.
        PoolCandidate::factory()->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // Expired in pool - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => '2000-01-01',
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // Already placed - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::PLACED_TERM->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);
        // User status inactive - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ]),
        ]);

        // Query specifying just a pool will return all non-expired, available-status candidates whose Users are looking for or open to opportunities.
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                ],
            ]
        );
        $response->assertJson([
            'data' => [
                'countApplicantsForSearch' => 15, // including base admin user
            ],
        ]);

        // Assert query with another filter will return proper count
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicantsForSearch($where: ApplicantFilterInput) {
                countApplicantsForSearch(where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => LanguageAbility::ENGLISH->name,
                ],
            ]
        )->assertJson([
            'data' => [
                'countApplicantsForSearch' => 10, // including base admin user
            ],
        ]);
    }

    #[DataProvider('adminTableFilterProvider')]
    public function testAdminTableFilter($where, $expectedResultCount): void
    {
        // Create 5 users
        User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'rob',
            'email' => 'bob@user.com',
            'telephone' => '12345',
        ]);
        User::factory()->create([
            'first_name' => 'sam',
            'last_name' => 'ram',
            'email' => 'sam@user.com',
            'telephone' => '67890',
        ]);
        User::factory()->create([
            'first_name' => 'dan',
            'last_name' => 'man',
            'email' => 'dan@user.com',
            'telephone' => '99999',
        ]);
        User::factory()->create([
            'first_name' => 'sir',
            'last_name' => 'whir',
            'email' => 'sir@user.com',
            'telephone' => '22222',
        ]);
        User::factory()->create([
            'first_name' => 'zak',
            'last_name' => 'pak',
            'email' => 'zak@admin.com',
            'telephone' => '333333',
        ]);

        // Remember the admin user exists:
        // 'email' => 'admin@test.com',
        // 'sub' => 'admin@test.com',

        // Assert no filters returns all five users plus admin@test.com
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
                'where' => $where,
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => $expectedResultCount,
                    ],
                ],
            ],
        ]);
    }

    public static function adminTableFilterProvider()
    {
        return [
            'no filters returns all five users plus admin@test.com' => [[], 6],
            'name filtering, casing should not matter' => [['name' => 'sAm'], 1],
            'ensure single letter returns all relevant results' => [['name' => 'r'], 3],
            'test a full name' => [['name' => 'BoB rOb'], 1],
            'test name segments' => [['name' => 'bo ro'], 1],
            'test name segments but in reverse' => [['name' => 'ro bo'], 1],
            'ensure queries with multiple filter variables apply separately as AND operations (builds off assertion above)' => [[
                'name' => 'r',
                'telephone' => '12345',
            ], 1],
            'assert email filter with partial email returns correct count' => [['email' => 'user.com'], 4],
            'assert more than one search term results in AND filtering' => [['generalSearch' => 'sam 67890'], 1],
            'assert filtering for last name in general search returns correct count' => [['generalSearch' => 'man'], 1],
            'assert filtering general search and name search (both subqueries) filter as AND' => [[
                'generalSearch' => '@user.com',
                'name' => 'zak',
            ], 0],
        ];
    }

    public function testNullFiltersEqualToUndefined(): void
    {
        // Create users to test filters on
        User::factory(60)->create();

        // Assert that using an empty (ie undefined) filter returns all users
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
                        'total' => 61,
                    ],
                ],
            ],
        ]);

        // Assert that setting every value to null also returns all users
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
                        'hasDiploma' => null,
                        'equity' => null,
                        'languageAbility' => null,
                        'operationalRequirements' => null,
                        'locationPreferences' => null,
                        'positionDuration' => null,
                        'skills' => null,
                        'pools' => null,
                    ],
                    'poolFilters' => null,
                    'isProfileComplete' => null,
                    'isGovEmployee' => null,
                    'telephone' => null,
                    'email' => null,
                    'name' => null,
                    'generalSearch' => null,
                ],
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61,
                    ],
                ],
            ],
        ]);
    }

    /** After running addSkills, the user should have a UserSkill for each added skill. */
    public function testAddSkillsAddsUserSkills(): void
    {
        $skills = Skill::factory(3)->create();
        $this->platformAdmin->addSkills($skills->pluck('id'));
        $userSkillSkillIds = $this->platformAdmin->userSkills->pluck('skill_id');
        $this->assertSameSize($skills, $userSkillSkillIds);
        foreach ($skills as $skill) {
            $this->assertContains($skill->id, $userSkillSkillIds);
        }
    }

    public function testAddSkillsRestoresSoftDeletedUserSkills(): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
        ]);
        $this->platformAdmin->userSkills->first()->delete();
        // The user skill should be trashed (soft-deleted) and by default shouldn't appear in results.
        $this->assertSoftDeleted($userSkill);
        $this->assertEmpty($this->platformAdmin->refresh()->userSkills);
        // Adding the same skill should restore the previous userSkill
        $this->platformAdmin->addSkills([$userSkill->skill_id]);
        $this->assertNotSoftDeleted($userSkill);
        $this->assertContains($userSkill->id, $this->platformAdmin->refresh()->userSkills->pluck('id'));
    }

    public function testAddSkillsDoesNotAddDuplicates(): void
    {
        $skills = Skill::factory(3)->create();
        // The user will already have the first skill.
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
            'skill_id' => $skills[0]->id,
        ]);
        $addSkills = [
            $skills[0]->id, // This skill is already present
            $skills[1]->id,
            $skills[1]->id, // We will try to add this skill twice.
            $skills[2]->id,
        ];
        $this->platformAdmin->addSkills($addSkills);
        // After adding, user should still only have 3 userSkills.
        $this->assertCount(3, $this->platformAdmin->userSkills);
    }

    public function testRoleAssignmentScope(): void
    {
        $testPool = Pool::factory()->create();
        $testCommunity = Community::factory()->create();

        $adminId = Role::where('name', 'platform_admin')->value('id');
        $processOperatorId = Role::where('name', 'process_operator')->value('id');
        $communityRecruiterId = Role::where('name', 'community_recruiter')->value('id');
        $communityAdminId = Role::where('name', 'community_admin')->value('id');

        // Create users
        User::factory(1)->asAdmin()->create();
        User::factory(3)->asGuest()->create();
        User::factory(11)->asApplicant()->create();

        User::factory(2)->asProcessOperator($testPool->id)->create();
        User::factory(3)->asCommunityRecruiter($testCommunity->id)->create();
        User::factory(3)->asCommunityAdmin($testCommunity->id)->create();

        $query =
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ';

        $empty = ['where' => []];
        $nullRoles = ['where' => ['roles' => null]];
        $adminRoles = ['where' => ['roles' => [$adminId]]];
        $processRoles = ['where' => ['roles' => [$processOperatorId]]];
        $recruiterRoles = ['where' => ['roles' => [$communityRecruiterId]]];
        $communityAdminRoles = ['where' => ['roles' => [$communityAdminId]]];
        $communityCombinedRoles = ['where' => ['roles' => [$communityAdminId, $communityRecruiterId]]]; // check more than one role at a time

        assertSame(24, count(User::all())); // ensure total user count is expected 24

        // assert each query returns expected count
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $empty)
            ->assertJsonFragment([
                'total' => 24,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $nullRoles)
            ->assertJsonFragment([
                'total' => 24,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $adminRoles)
            ->assertJsonFragment([
                'total' => 2, // includes created and setup admins
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $processRoles)
            ->assertJsonFragment([
                'total' => 2,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $recruiterRoles)
            ->assertJsonFragment([
                'total' => 3,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $communityAdminRoles)
            ->assertJsonFragment([
                'total' => 3,
            ]);
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query, $communityCombinedRoles)
            ->assertJsonFragment([
                'total' => 6,
            ]);
    }

    public function testUpdateUserIsStatusOrNonStatusRule(): void
    {
        $applicant = User::factory()->asApplicant()->create();

        $updateUserAsUser =
            /** @lang GraphQL */
            '
            mutation updateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!){
                updateUserAsUser(id: $id, user: $user) {
                    indigenousCommunities {
                        value
                    }
                }
            }
        ';

        // assert user can set STATUS or NON_STATUS but not both
        $this->actingAs($applicant, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $applicant->id,
                    'user' => [
                        'indigenousCommunities' => [IndigenousCommunity::STATUS_FIRST_NATIONS->name],
                    ],
                ]
            )
            ->assertJsonFragment(['indigenousCommunities' => [[
                'value' => IndigenousCommunity::STATUS_FIRST_NATIONS->name,
            ]]]);
        $this->actingAs($applicant, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $applicant->id,
                    'user' => [
                        'indigenousCommunities' => [IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name],
                    ],
                ]
            )
            ->assertJsonFragment(['indigenousCommunities' => [[
                'value' => IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name,
            ]]]);
        $this->actingAs($applicant, 'api')
            ->graphQL(
                $updateUserAsUser,
                [
                    'id' => $applicant->id,
                    'user' => [
                        'indigenousCommunities' => [IndigenousCommunity::STATUS_FIRST_NATIONS->name, IndigenousCommunity::NON_STATUS_FIRST_NATIONS->name],
                    ],
                ]
            )
            ->assertGraphQLValidationError('user.indigenousCommunities', ErrorCode::BOTH_STATUS_NON_STATUS->name);
    }

    public function testUserUpdatingSub(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $baseUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'base-user@test.com',
                'sub' => 'base-user@test.com',
            ]);
        $adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->actingAs($baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                    updateUserSub(updateUserSubInput:$updateUserSubInput) {
                        sub
                    }
                    }
                ',
            [
                'updateUserSubInput' => [
                    'userId' => $baseUser->id,
                    'sub' => 'admin123',
                ],
            ]
        )->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                    updateUserSub(updateUserSubInput:$updateUserSubInput) {
                        sub
                    }
                    }
                ',
            [
                'updateUserSubInput' => [
                    'userId' => $baseUser->id,
                    'sub' => 'admin123',
                ],
            ]
        )->assertJsonFragment([
            'sub' => 'admin123',
        ]);
    }

    public function testUsersNestedPoolCandidates(): void
    {
        // applicant has one submitted and one draft application
        $applicant = User::factory()->asApplicant()->create();
        $draftApplication = PoolCandidate::factory()->create([
            'user_id' => $applicant->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'submitted_at' => null,
        ]);
        $submittedApplication = PoolCandidate::factory()->create([
            'user_id' => $applicant->id,
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'submitted_at' => config('constants.past_date'),
        ]);

        $candidateCount = count(PoolCandidate::all());
        assertSame(2, $candidateCount);

        $query =
            /** @lang GraphQL */
            '
            query user($id: UUID!) {
                user(id: $id) {
                    poolCandidates {
                        id
                    }
                }
            }
        ';

        // assert admin can fetch applicant user and their applications without error
        // assert the JSON superset only contains one application
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query,
                [
                    'id' => $applicant->id,
                ]
            )->assertJson([
                'data' => [
                    'user' => [
                        'poolCandidates' => [
                            ['id' => $submittedApplication->id],
                        ],
                    ],
                ],
            ]);
    }

    public function testIsVerifiedGovernmentEmployeeAccessor()
    {
        $user = User::factory()
            ->withGovEmployeeProfile()
            ->create();

        $this->assertTrue($user->isVerifiedGovEmployee);

        $user->work_email_verified_at = null;
        $user->save();
        $this->assertFalse($user->isVerifiedGovEmployee);

        $user->work_email_verified_at = now();
        $user->work_email = null;
        $user->save();
        $this->assertFalse($user->isVerifiedGovEmployee);

        $user->work_email = 'email@domain.com';
        $user->computed_is_gov_employee = false;
        $user->save();
        $this->assertFalse($user->isVerifiedGovEmployee);

    }

    public function testMultipleSubstantiveExperiences()
    {
        $user = User::factory()
            ->asApplicant()
            ->create();

        // Nonsubstantive
        WorkExperience::factory()
            ->create([
                'user_id' => $user->id,
                'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                'gov_employment_type' => GovEmployeeType::CASUAL->name,
            ]);

        $exp1 = WorkExperience::factory()
            ->asSubstantive()
            ->create(['user_id' => $user->id]);

        $exp2 = WorkExperience::factory()
            ->asSubstantive()
            ->create(['user_id' => $user->id]);

        $this->actingAs($user, 'api')
            ->graphQL('query Me { me { currentSubstantiveExperiences { id } } }')
            ->assertJsonFragment([[
                ['id' => $exp1->id],
                ['id' => $exp2->id],
            ]]);

        $this->assertCount(2, $user->current_substantive_experiences);

    }

    public function testNoSubstantiveExperiences()
    {
        $user = User::factory()
            ->asApplicant()
            ->create();

        // Nonsubstantive
        WorkExperience::factory()
            ->create([
                'user_id' => $user->id,
                'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                'gov_employment_type' => GovEmployeeType::CASUAL->name,
            ]);

        $this->actingAs($user, 'api')
            ->graphQL('query Me { me { currentSubstantiveExperiences { id } } }')
            ->assertJsonFragment([
                'currentSubstantiveExperiences' => [],
            ]);

        $this->assertEmpty($user->current_substantive_experiences);

    }

    // test bookmarking a candidate and fetching it as a field on User
    public function testPoolCandidateUserBookmark()
    {
        // setup
        PoolCandidate::truncate();

        $query = <<<'GRAPHQL'
        query me {
            me {
                poolCandidateBookmarks {
                    id
                }
            }
        }
        GRAPHQL;

        $mutation = <<<'GRAPHQL'
        mutation TogglePoolCandidateUserBookmark($poolCandidateId: UUID!) {
            togglePoolCandidateUserBookmark(poolCandidateId: $poolCandidateId)
        }
        GRAPHQL;

        $poolCandidate = PoolCandidate::factory()
            ->availableInSearch()
            ->create();

        // assert user starts with no bookmarks
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query)
            ->assertExactJson([
                'data' => [
                    'me' => [
                        'poolCandidateBookmarks' => [],
                    ],
                ],
            ]);

        // assert mutation successful and it returns TRUE as it created a bookmark
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($mutation, ['poolCandidateId' => $poolCandidate->id])
            ->assertExactJson([
                'data' => [
                    'togglePoolCandidateUserBookmark' => true,
                ],
            ]);

        // assert user has the one bookmark
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query)
            ->assertExactJson([
                'data' => [
                    'me' => [
                        'poolCandidateBookmarks' => [
                            [
                                'id' => $poolCandidate->id,
                            ],
                        ],
                    ],
                ],
            ]);

        // assert mutation successful and it returns FALSE as it destroyed a bookmark
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($mutation, ['poolCandidateId' => $poolCandidate->id])
            ->assertExactJson([
                'data' => [
                    'togglePoolCandidateUserBookmark' => false,
                ],
            ]);

        // assert user no longer has bookmarks
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($query)
            ->assertExactJson([
                'data' => [
                    'me' => [
                        'poolCandidateBookmarks' => [],
                    ],
                ],
            ]);
    }
}
