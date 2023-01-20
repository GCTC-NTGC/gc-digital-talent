<?php

use App\Models\User;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Classification;
use App\Models\Skill;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use App\Models\GenericJobTitle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;

class UserTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootClearsSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    public function testCreateUserDefaultRoles()
    {
        $this->graphQL(
            /** @lang GraphQL */
            '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang
                    preferredLanguageForInterview
                    preferredLanguageForExam
                    roles
                }
            }
        ',
            [
                'user' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    // If roles is not set, it should come back as empty array.
                ]
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
                    'roles' => []
                ]
            ]
        ]);
        // Ensure user was saved
        $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
    }

    public function testCreateUserAdminRole()
    {
        $this->graphQL(
            /** @lang GraphQL */
            '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang
                    preferredLanguageForInterview
                    preferredLanguageForExam
                    roles
                }
            }
        ',
            [
                'user' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'roles' => ['ADMIN']
                ]
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
                    'roles' => ['ADMIN']
                ]
            ]
        ]);
        // Ensure user was saved
        $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
    }

    public function testUpdateUserRole()
    {
        $user = User::factory()->create(['roles' => []]);
        $this->graphQL(
            /** @lang GraphQL */
            '
            mutation UpdateUser($id: ID!, $user: UpdateUserAsAdminInput!) {
                updateUserAsAdmin(id: $id, user: $user) {
                    id
                    roles
                }
            }
        ',
            [
                'id' => $user->id,
                'user' => [
                    'roles' => ['ADMIN']
                ]
            ]
        )->assertJson([
            'data' => [
                'updateUserAsAdmin' => [
                    'id' => strval($user->id),
                    'roles' => ['ADMIN']
                ]
            ]
        ]);
        // Ensure change was saved
        $this->assertContains('ADMIN', $user->fresh()->roles);
    }

    public function testFilterByPoolCandidateStatuses(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);
        $pool2 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
        ]);
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
        ]);
        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => null,
        ]);
        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_REMOVED,
        ]);

        // Assert query with no pool filter will return all users, including unavailable
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 16
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter but no statuses filter
        $this->graphQL(
            /** @lang Graphql */
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
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, only expired status
        $this->graphQL(
            /** @lang Graphql */
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
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_EXPIRED],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, only removed status
        $this->graphQL(
            /** @lang Graphql */
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
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_REMOVED],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, expired + removed + available statuses
        $this->graphQL(
            /** @lang Graphql */
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
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_EXPIRED, ApiEnums::CANDIDATE_STATUS_REMOVED],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, empty array of statuses will return all candidates in pool.
        $this->graphQL(
            /** @lang Graphql */
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
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13
                    ]
                ]
            ]
        ]);

        // Assert query with unknown pool filter will return zero
        $this->graphQL(
            /** @lang Graphql */
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
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByCandidateExpiryDate(): void
    {
        // myPool will be people we're querying for and should be returned
        $myPool = Pool::factory()->create(['name' => 'myPool']);
        // otherPool will be people we're not querying for and should not be returned
        $otherPool = Pool::factory()->create(['name' => 'otherPool']);

        // Create some valid users in myPool, AVAILABLE status to ensure filter by pool only changes off expiry date in this test
        PoolCandidate::factory()->count(4)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // A candidate which expires today is not expired YET.
        PoolCandidate::factory()->create([
            'expiry_date' => date("Y-m-d"),
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // Candidates without expiry dates are considered active.
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => null,
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // Create some expired users in myPool
        PoolCandidate::factory()->count(2)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Create some valid users in otherPool
        PoolCandidate::factory()->count(5)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => date("Y-m-d"),
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => null,
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // Create some expired users in otherPool
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Assert query with no parameters returns all users
        $this->graphQL(
            /** @lang Graphql */
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
                        'total' => 23
                    ]
                ]
            ]
        ]);

        // Assert query with pool and expiryStatus ACTIVE returns correct users
        $response = $this->graphQL(
            /** @lang Graphql */
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
                            'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        );
        $response->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query for pool without setting expiryStatus returns ACTIVE users
        $this->graphQL(
            /** @lang Graphql */
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
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with pool and expiryStatus EXPIRED returns correct users
        $this->graphQL(
            /** @lang Graphql */
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
                            'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with pool and expiryStatus ALL returns all users in pool
        $this->graphQL(
            /** @lang Graphql */
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
                            'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ALL,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByLanguageAbility(): void
    {
        User::factory()->count(5)->create([
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
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
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 9
                    ]
                ]
            ]
        ]);

        // Assert query with ENGLISH filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'languageAbility' => "ENGLISH"
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with FRENCH filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'languageAbility' => "FRENCH"
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with BILINGUAL filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'languageAbility' => "BILINGUAL"
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByClassification(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'expected_salary' => [], // remove salaries to avoid accidental classification-to-salary matching
        ]);

        // Create new classification and attach to two new users.
        $classification = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 1,
        ]);
        User::factory()->count(2)->create()->each(function ($user) use ($classification) {
            $user->expectedClassifications()->save($classification);
        });

        // Assert query with no classifications filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with classification filter will return correct number of users
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [['group' => 'ZZ', 'level' => 1]],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown classification filter will return zero
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234]],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByClassificationToSalary(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'expected_salary' => []
        ]);

        // Create new classification.
        $classificationLvl1 = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 1,
            'min_salary' => 50000,
            'max_salary' => 69000,
        ]);

        // Attach new users that are in the expected salary range.
        $user1 = User::factory()->create([
            'expected_salary' => ['_50_59K', '_70_79K']
        ]);
        $user1->expectedClassifications()->delete();
        $user1->expectedClassifications()->save($classificationLvl1);

        // Attach new users that overlap the expected salary range.
        $user2 = User::factory()->create([
            'expected_salary' => ['_60_69K', '_80_89K']
        ]);
        $user2->expectedClassifications()->delete();

        // Attach new users that are over the expected salary range.
        $user3 = User::factory()->create([
            'expected_salary' => ['_90_99K', '_100K_PLUS']
        ]);
        $user3->expectedClassifications()->delete();

        // Assert query with no classifications filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 9
                    ]
                ]
            ]
        ]);

        // Assert query with classification filter will return users in range and overlapping.
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [['group' => 'ZZ', 'level' => 1]],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown classification filter will return zero
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234]],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByClassificationToGenericJobTitle(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'expected_salary' => []
        ]);

        // Create classifications and Generics
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        // Create 3 users which correspond to IT-03
        User::factory()->count(1)->create(['expected_salary' => []])->each(function ($user) {
            $user->expectedGenericJobTitles()->sync(
                GenericJobTitle::where('key', ApiEnums::GENERIC_JOB_TITLE_KEY_TEAM_LEADER_IT03)->get()
            );
        });
        User::factory()->count(2)->create(['expected_salary' => []])->each(function ($user) {
            $user->expectedGenericJobTitles()->sync(
                GenericJobTitle::where('key', ApiEnums::GENERIC_JOB_TITLE_KEY_TECHNICAL_ADVISOR_IT03)->get()
            );
        });
        // Create 4 users which correspond to IT-04
        User::factory()->count(4)->create(['expected_salary' => []])->each(function ($user) {
            $user->expectedGenericJobTitles()->sync(
                GenericJobTitle::where('key', ApiEnums::GENERIC_JOB_TITLE_KEY_SENIOR_ADVISOR_IT04)->get()
            );
        });
        // Create 7 users which correspond to both IT-03 and IT-04
        User::factory()->count(7)->create(['expected_salary' => []])->each(function ($user) {
            $user->expectedGenericJobTitles()->sync(
                GenericJobTitle::whereIn('key', [
                    ApiEnums::GENERIC_JOB_TITLE_KEY_SENIOR_ADVISOR_IT04,
                    ApiEnums::GENERIC_JOB_TITLE_KEY_TECHNICAL_ADVISOR_IT03
                ])->get()
            );
        });


        // Assert query with no classifications filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 20
                    ]
                ]
            ]
        ]);

        // Assert query with one classification filter will return correct number of users.
        $results = $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [['group' => 'IT', 'level' => 3]],
                    ]
                ]
            ]
        );
        $results->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with two classification filters will return correct number of users
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [
                            ['group' => 'IT', 'level' => 3],
                            ['group' => 'IT', 'level' => 4]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14
                    ]
                ]
            ]
        ]);

        // Assert that adding an unknown classification to query to classification won't reduce number of users
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => [
                            ['group' => 'IT', 'level' => 3],
                            ['group' => 'IT', 'level' => 4],
                            ['group' => 'QQ', 'level' => 9]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByOperationalRequirements(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'accepted_operational_requirements' => null,
        ]);
        $operationalRequirement1 = 'OVERTIME_SCHEDULED';
        $operationalRequirement2 = 'SHIFT_WORK';
        $operationalRequirement3 = 'ON_CALL';

        // Create a few with a op_req 1
        User::factory()->count(2)->create([
            'accepted_operational_requirements' => [$operationalRequirement1],
        ]);

        // Create a few with op_req 1 and 2
        User::factory()->count(2)->create([
            'accepted_operational_requirements' => [$operationalRequirement1, $operationalRequirement2],
        ]);

        // Assert query with no operationalRequirements filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with empty operationalRequirements filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                        'operationalRequirements' => []
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with one operationalRequirement filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert query with two operationalRequirement filters will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with an unused operationalRequirement filter will return zero
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByLocationPreferences(): void
    {
        // Create 5 new users with a ONTARIO location preference.
        User::factory()->count(5)->create([
            'location_preferences' => ["ONTARIO"],
        ]);

        // Create 2 new users with a TELEWORK location preference.
        User::factory()->count(2)->create([
            'location_preferences' => ["TELEWORK"],
        ]);

        // Assert query with no locationPreferences filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with locationPreferences filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'locationPreferences' => ["TELEWORK"],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with empty locationPreferences filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
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
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with hasDiploma filter set to true will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with hasDiploma filter set to false will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByAcceptTemporary(): void
    {
        // Create initial set of 5 users which wouldn't accept temporary.
        User::factory()->count(5)->create([
            'position_duration' => [ApiEnums::POSITION_DURATION_PERMANENT],
        ]);

        // Create two new users who would accept a temporary.
        User::factory()->count(2)->create([
            'position_duration' => [ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT],
        ]);

        // Assert query no positionDuration filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with position duration filter set to temporary will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'positionDuration' => [ApiEnums::POSITION_DURATION_TEMPORARY],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with position duration filter set to null will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByJobLookingStatus(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'job_looking_status' => null,
        ]);
        $availableStatus = 'ACTIVELY_LOOKING';
        $openStatus = 'OPEN_TO_OPPORTUNITIES';
        $inactiveStatus = 'INACTIVE';

        // Create a few with a op_req 1
        User::factory()->count(3)->create([
            'job_looking_status' => $availableStatus,
        ]);

        // Create a few with op_req 1 and 2
        User::factory()->count(2)->create([
            'job_looking_status' => $openStatus,
        ]);

        // Assert query with no jobLookingStatus filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 11
                    ]
                ]
            ]
        ]);

        // Assert query with empty jobLookingStatus filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                    'jobLookingStatus' => []
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 11
                    ]
                ]
            ]
        ]);

        // Assert query with one jobLookingStatus filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                    'jobLookingStatus' => [$availableStatus],
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with two jobLookingStatus filters will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                    'jobLookingStatus' => [$availableStatus, $openStatus],
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 5
                    ]
                ]
            ]
        ]);

        // Assert query with an unused jobLookingStatus filter will return zero
        $this->graphQL(
            /** @lang Graphql */
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
                    'jobLookingStatus' => [$inactiveStatus],
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
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
            ->afterCreating(function ($user) {
                $user->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);
            })
            ->create([
                'current_province' => 'ONTARIO',
                'location_preferences' => ['PRAIRIE'],
                'looking_for_english' => null,
                'looking_for_french' => true,
                'looking_for_bilingual' => null,
                'telephone' => '+15407608748',
                'current_city' => 'Somewhere random',
                'is_gov_employee' => false,
                'expected_salary' => ['_50_59K'],
            ]);

        // Assert query no isProfileComplete filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14
                    ]
                ]
            ]
        ]);

        // Assert query with isProfileComplete filter set to true will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with isProfileComplete filter set to false will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14
                    ]
                ]
            ]
        ]);
    }

    public function testFilterBySkills(): void
    {
        // Create initial data set
        Skill::factory()->count(20)->create();
        User::factory()->count(5)->create()->each(function ($user) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                    $model->skills()->sync($skills);
                })->create();
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                    $model->skills()->sync($skills);
                })->create();
            EducationExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                    $model->skills()->sync($skills);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                    $model->skills()->sync($skills);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->pluck('id')->toArray();
                    $model->skills()->sync($skills);
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
                    $model->skills()->sync([$skill1['id']]);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->skills()->sync([$skill1['id']]);
                })->create();
        })->create();
        User::factory()->afterCreating(function ($user) use ($skill1, $skill2) {
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->skills()->sync([$skill1['id']]);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill2) {
                    $model->skills()->sync([$skill2['id']]);
                })->create();
        })->create();

        // Assert query no skills filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query empty skills filter array will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                        'skills' => []
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with one skills filter will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'skills' => [
                            ['id' => $skill1['id']]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with two skills will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'skills' => [
                            ['id' => $skill1['id']],
                            ['id' => $skill2['id']]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with unused skill will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                        'skills' => [
                            ['id' => $skill3['id']]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByGovEmployee(): void
    {
        // Create initial set of 5 users not with gov.
        User::factory()->count(5)->create([
            'is_gov_employee' => false,
        ]);

        // Create two new users with the government.
        User::factory()->count(2)->create([
            'is_gov_employee' => true,
        ]);

        // Assert query no isGovEmployee filter will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with isGovEmployee filter set to true will return correct user count
        $this->graphQL(
            /** @lang Graphql */
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
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with isGovEmployee filter set to false will return all users
        $this->graphQL(
            /** @lang Graphql */
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
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testOrdering(): void
    {
        // Create users for testing
        User::factory()->count(8)->create();
        $usersByName = User::select('id')->orderBy('first_name')->get()->toArray();
        $usersByCreated = User::select('id')->orderByDesc('created_at')->get()->toArray();

        // Assert query no orderBy given defaults to created_at desc
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByCreated
                ]
            ]
        ]);

        // Assert query orders by given attribute
        $this->graphQL(
            /** @lang Graphql */
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
                        'order' => 'ASC'
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByName
                ]
            ]
        ]);
    }

    public function testFilterByClassificationToSalaryWithPools(): void
    {
        // myPool will be people we're querying for and should be returned
        $myPool = Pool::factory()->create(['name' => 'myPool']);
        // otherPool will be people we're not querying for and should not be returned
        $otherPool = Pool::factory()->create(['name' => 'otherPool']);

        // myClassification is the classification we will be querying for
        $myClassification = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 1,
            'min_salary' => 55000,
            'max_salary' => 64999,
        ]);

        // *** first make three users in the right pool - 1 has an exact classification match, 1 has a salary to classification match, 1 has no match
        // attach AVAILABLE status to ensure filtering by pools doesn't filter by status
        // Attach new user in the pool with the desired classification
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function ($user) use ($myClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($myClassification);
            })->create([
                'expected_salary' => []
            ]),
            'pool_id' => $myPool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Attach new user in the pool that overlaps the expected salary range and has a matching class group (but not level).
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function ($user) {
                $user->expectedClassifications()->delete();
            })->create([
                'expected_salary' => ['_60_69K']
            ]),
            'pool_id' => $myPool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Attach new user in the pool that is over the expected salary range and has a matching class group (but not level).
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function ($user) {
                $user->expectedClassifications()->delete();
            })->create([
                'expected_salary' => ['_90_99K', '_100K_PLUS']
            ]),
            'pool_id' => $myPool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // *** now make the same three users in the wrong pool

        // Attach new user in the pool with the desired classification WRONG POOL
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function ($user) use ($myClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($myClassification);
            })->create([
                'expected_salary' => []
            ]),
            'pool_id' => $otherPool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Attach new user in the pool that overlaps the expected salary range and has a matching class group (but not level). WRONG POOL
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function ($user) {
                $user->expectedClassifications()->delete();
            })->create([
                'expected_salary' => ['_60_69K']
            ]),
            'pool_id' => $otherPool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Attach new user in the pool that is over the expected salary range and has a matching class group (but not level).  WRONG POOL
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function ($user) {
                $user->expectedClassifications()->delete();
            })->create([
                'expected_salary' => ['_90_99K', '_100K_PLUS']
            ]),
            'pool_id' => $otherPool->id,
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Assert query with just pool filters will return all users in that pool
        $this->graphQL(
            /** @lang Graphql */
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
                        'pools' => [
                            ['id' => $myPool->id],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with classification filter will return users in range and overlapping in that pool
        $this->graphQL(
            /** @lang Graphql */
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
                        'pools' => [
                            ['id' => $myPool->id],
                        ],
                        'expectedClassifications' => [['group' => 'ZZ', 'level' => 1]]
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown classification filter will return zero
        $this->graphQL(
            /** @lang Graphql */
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
                        'pools' => [
                            ['id' => $myPool->id]
                        ],
                        'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234]],
                    ],
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testCountApplicantsQuery(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);
        $pool2 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(8)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_OPEN_TO_OPPORTUNITIES
            ])
        ]);
        // Should appear in searches, but in pool 2.
        PoolCandidate::factory()->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);
        // Expired in pool - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => '2000-01-01',
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ])
        ]);
        // Already placed - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_OPEN_TO_OPPORTUNITIES
            ])
        ]);
        // User status inactive - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
                'job_looking_status' => ApiEnums::USER_STATUS_INACTIVE
            ])
        ]);

        // Query specifying just a pool will return all non-expired, available-status candidates whose Users are looking for or open to opportunities.
        $response = $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ]
                ]
            ]
        );
        $response->assertJson([
            'data' => [
                'countApplicants' => 13
            ]
        ]);

        // Assert query with another filter will return proper count
        $this->graphQL(
            /** @lang Graphql */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => ApiEnums::LANGUAGE_ABILITY_ENGLISH
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 8
            ]
        ]);
    }

    public function testAdminTableFilter(): void
    {
        // Create 5 users
        User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'rob',
            'email' => "bob@user.com",
            'telephone' => "12345",
        ]);
        User::factory()->create([
            'first_name' => 'sam',
            'last_name' => 'ram',
            'email' => "sam@user.com",
            'telephone' => "67890",
        ]);
        User::factory()->create([
            'first_name' => 'dan',
            'last_name' => 'man',
            'email' => "dan@user.com",
            'telephone' => "99999",
        ]);
        User::factory()->create([
            'first_name' => 'sir',
            'last_name' => 'whir',
            'email' => "sir@user.com",
            'telephone' => "22222",
        ]);
        User::factory()->create([
            'first_name' => 'zak',
            'last_name' => 'pak',
            'email' => "zak@admin.com",
            'telephone' => "333333",
        ]);

        // Assert no filters returns all five users plus admin@test.com
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 6
                    ]
                ]
            ]
        ]);

        // Name filtering  //
        // casing should not matter
        $this->graphQL(
            /** @lang Graphql */
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
                    'name' => 'sAm',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
        // ensure single letter returns all relevant results
        $this->graphQL(
            /** @lang Graphql */
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
                    'name' => 'r',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);
        // test a full name
        $this->graphQL(
            /** @lang Graphql */
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
                    'name' => 'BoB rOb',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
        // test name segments
        $this->graphQL(
            /** @lang Graphql */
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
                    'name' => 'bo ro',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
        // test name segments but in reverse
        $this->graphQL(
            /** @lang Graphql */
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
                    'name' => 'ro bo',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // ensure queries with multiple filter variables apply separately as AND operations (builds off assertion above)
        $this->graphQL(
            /** @lang Graphql */
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
                    'name' => 'r',
                    'telephone' => "12345",
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert email filter with partial email returns correct count
        $this->graphQL(
            /** @lang Graphql */
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
                    'email' => 'user.com',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert filtering for phone digit in general search returns correct count
        $this->graphQL(
            /** @lang Graphql */
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
                    'generalSearch' => '9',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert filtering for last name in general search returns correct count
        $this->graphQL(
            /** @lang Graphql */
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
                    'generalSearch' => 'man',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert filtering general search and name search (both subqueries) filter as AND
        $this->graphQL(
            /** @lang Graphql */
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
                    'generalSearch' => '@user.com',
                    'name' => 'zak',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testNullFiltersEqualToUndefined(): void {
        // Create users to test filters on
        User::factory(60)->create();

        // Assert that using an empty (ie undefined) filter returns all users
        $this->graphQL(
            /** @lang Graphql */
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
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61
                    ]
                ]
            ]
        ]);

        // Assert that setting every value to null also returns all users
        $this->graphQL(
            /** @lang Graphql */
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
                        'expectedClassifications' => null,
                        'skills' => null,
                        'pools' => null,
                    ],
                    'poolFilters' => null,
                    'jobLookingStatus' => null,
                    'isProfileComplete' => null,
                    'isGovEmployee' => null,
                    'telephone' => null,
                    'email' => null,
                    'name' => null,
                    'generalSearch' => null
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61
                    ]
                ]
            ]
        ]);
    }
}
