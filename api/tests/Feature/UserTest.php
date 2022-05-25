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
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class UserTest extends TestCase
{
    use DatabaseMigrations;
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
        $this->markTestSkipped('Todo: Fix. https://github.com/GCTC-NTGC/gc-digital-talent/issues/1480');
        $this->graphQL(/** @lang GraphQL */ '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang
                    roles
                }
            }
        ', [
            'user' => [
                'firstName' => 'Jane',
                'lastName' => 'Tester',
                'email' => 'jane@test.com',
                // If roles is not set, it should come back as empty array.
            ]
        ])->seeJson([
            'data' => [
                'createUser' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'telephone' => null,
                    'preferredLang' => null,
                    'roles' => []
                ]
            ]
        ]);
        // Ensure user was saved
        $this->seeInDatabase('users', ['email' => 'jane@test.com']);
    }

    public function testCreateUserAdminRole()
    {
        $this->markTestSkipped('Todo: Fix. https://github.com/GCTC-NTGC/gc-digital-talent/issues/1480');
        $this->graphQL(/** @lang GraphQL */ '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang
                    roles
                }
            }
        ', [
            'user' => [
                'firstName' => 'Jane',
                'lastName' => 'Tester',
                'email' => 'jane@test.com',
                'roles' => ['ADMIN']
            ]
        ])->seeJson([
            'data' => [
                'createUser' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'telephone' => null,
                    'preferredLang' => null,
                    'roles' => ['ADMIN']
                ]
            ]
        ]);
        // Ensure user was saved
        $this->seeInDatabase('users', ['email' => 'jane@test.com']);
    }

    public function testUpdateUserRole()
    {
        $this->markTestSkipped('Todo: Fix. https://github.com/GCTC-NTGC/gc-digital-talent/issues/1480');
        $user = User::factory()->create(['roles' => []]);
        $this->graphQL(/** @lang GraphQL */ '
            mutation UpdateUser($id: ID!, $user: UpdateUserInput!) {
                updateUser(id: $id, user: $user) {
                    id
                    roles
                }
            }
        ', [
            'id' => $user->id,
            'user' => [
                'roles' => ['ADMIN']
            ]
        ])->seeJson([
            'data' => [
                'updateUser' => [
                    'id' => strval($user->id),
                    'roles' => ['ADMIN']
                ]
            ]
        ]);
        // Ensure change was saved
        $this->assertContains('ADMIN', $user->fresh()->roles);
    }

    public function testFilterByPool(): void
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
            'pool_id' => $pool1['id']
        ]);
        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool2['id']
        ]);

        // Assert query with no pool filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter will return correct number of users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$pool2['id']]
                ]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown pool filter will return zero
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => ['00000000-0000-0000-0000-000000000000']
                ]
            ]
        ])->assertJson([
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

        // Create some valid users in myPool
        PoolCandidate::factory()->count(4)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $myPool->id,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => date("Y-m-d"),
            'pool_id' => $myPool->id,
        ]);
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => null,
            'pool_id' => $myPool->id,
        ]);
        // Create some expired users in myPool
        PoolCandidate::factory()->count(2)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $myPool->id,
        ]);

        // Create some valid users in otherPool
        PoolCandidate::factory()->count(5)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $otherPool->id,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => date("Y-m-d"),
            'pool_id' => $otherPool->id,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => null,
            'pool_id' => $otherPool->id,
        ]);
        // Create some expired users in otherPool
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $otherPool->id,
        ]);

        // Assert query with no parameters returns all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ')->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 23
                    ]
                ]
            ]
        ]);

        // Assert query for pool with default viewExpiredCandidates returns correct users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$myPool->id]
                ]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with pool and viewExpiredCandidates false returns correct users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$myPool->id],
                    'viewExpiredCandidates' => false
                ]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with pool and viewExpiredCandidates true returns correct users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$myPool->id],
                    'viewExpiredCandidates' => true,
                ]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByLanguageAbility(): void
    {
        User::factory()->count(5)->create([
            'language_ability' => 'TEST'
        ]);

        // Create new LanguageAbility and attach to 3 new pool users.
        User::factory()->create([
            'language_ability' => 'FRENCH'
        ]);
        User::factory()->create([
            'language_ability' => 'ENGLISH'
        ]);
        User::factory()->create([
            'language_ability' => 'BILINGUAL'
        ]);

        // Assert query with no LanguageAbility filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 9
                    ]
                ]
            ]
        ]);

        // Assert query with ENGLISH filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'languageAbility' => "ENGLISH"
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with FRENCH filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'languageAbility' => "FRENCH"
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with BILINGUAL filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'languageAbility' => "BILINGUAL"
            ]
        ])->assertJson([
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
        User::factory()->count(5)->create();

        // Create new classification and attach to two new users.
        $classification = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 1,
        ]);
        User::factory()->count(2)->create()->each(function($user) use ($classification) {
            $user->expectedClassifications()->save($classification);
        });

        // Assert query with no classifications filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with classification filter will return correct number of users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'expectedClassifications' => [['group' => 'ZZ', 'level' => 1 ]],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown classification filter will return zero
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
            ]
        ])->assertJson([
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
        User::factory()->count(5)->create();

        // Create new classification.
        $classificationLvl1 = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 1,
            'min_salary' => 50000,
            'max_salary' => 69000,
        ]);
        $classificationLvl2 = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 2,
            'min_salary' => 70000,
            'max_salary' => 89000,
        ]);
        $classificationLvl3 = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 3,
            'min_salary' => 90000,
            'max_salary' => 100000,
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
        $user2->expectedClassifications()->save($classificationLvl2);

        // Attach new users that are over the expected salary range.
        $user3 = User::factory()->create([
            'expected_salary' => ['_90_99K', '_100K_PLUS']
        ]);
        $user3->expectedClassifications()->delete();
        $user3->expectedClassifications()->save($classificationLvl3);


        // Assert query with no classifications filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 9
                    ]
                ]
            ]
        ]);

        // Assert query with classification filter will return users in range and overlapping.
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'expectedClassifications' => [['group' => 'ZZ', 'level' => 1 ]],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown classification filter will return zero
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
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
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with empty operationalRequirements filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'operationalRequirements' => []
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with one operationalRequirement filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'operationalRequirements' => [ $operationalRequirement1 ],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert query with two operationalRequirement filters will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'operationalRequirements' => [ $operationalRequirement1, $operationalRequirement2 ],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with an unused operationalRequirement filter will return zero
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'operationalRequirements' => [$operationalRequirement3],
            ]
        ])->assertJson([
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
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with locationPreferences filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'locationPreferences' => ["TELEWORK"],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with empty locationPreferences filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'locationPreferences' => [],
            ]
        ])->assertJson([
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
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with hasDiploma filter set to true will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'hasDiploma' => true,
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with hasDiploma filter set to false will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'hasDiploma' => false,
            ]
        ])->assertJson([
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
            'would_accept_temporary' => false,
        ]);

        // Create two new users who would accept a temporary.
        User::factory()->count(2)->create([
            'would_accept_temporary' => true,
        ]);

        // Assert query no wouldAcceptTemporary filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with wouldAcceptTemporary filter set to true will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'wouldAcceptTemporary' => true,
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with wouldAcceptTemporary filter set to false will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'wouldAcceptTemporary' => false,
            ]
        ])->assertJson([
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
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 11
                    ]
                ]
            ]
        ]);

        // Assert query with empty jobLookingStatus filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'jobLookingStatus' => []
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 11
                    ]
                ]
            ]
        ]);

        // Assert query with one jobLookingStatus filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'jobLookingStatus' => [ $availableStatus ],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with two jobLookingStatus filters will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'jobLookingStatus' => [ $availableStatus, $openStatus ],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 5
                    ]
                ]
            ]
        ]);

        // Assert query with an unused jobLookingStatus filter will return zero
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'jobLookingStatus' => [$inactiveStatus],
            ]
        ])->assertJson([
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

        // Create some complete users.
        User::factory()->count(3)->create([
            'current_province' => 'ONTARIO',
            'location_preferences' => ['PRAIRIE'],
            'looking_for_english' => null,
            'looking_for_french' => true,
            'looking_for_bilingual' => null,
            'telephone' => '+15407608748',
            'current_city' => 'Somewhere random',
            'is_gov_employee' => false,
            'expected_salary' => ['_50_59K'],
            'would_accept_temporary' => false,
        ]);

        // Assert query no isProfileComplete filter will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13
                    ]
                ]
            ]
        ]);

        // Assert query with isProfileComplete filter set to true will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'isProfileComplete' => true,
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with isProfileComplete filter set to false will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'isProfileComplete' => false,
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13
                    ]
                ]
            ]
        ]);
    }

    public function testFilterBySkills(): void
    {
        // Create initial data set
        Skill::factory()->count(20)->create();
        User::factory()->count(5)->create()->each(function($user) {
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
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query empty skills filter array will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'skills' => []
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with one skills filter will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'skills' => [$skill1['id']]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with two skills will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'skills' => [$skill1['id'], $skill2['id']]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with unused skill will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'skills' => [$skill3['id']]
            ]
        ])->assertJson([
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
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with isGovEmployee filter set to true will return correct user count
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'isGovEmployee' => true,
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with isGovEmployee filter set to false will return all users
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'isGovEmployee' => false,
            ]
        ])->assertJson([
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
        $usersById = User::select('id')->orderBy('id')->get()->toArray();

        // Assert query no orderBy given defaults to id
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    data {
                        id
                    }
                }
            }
        ', [
            'where' => []
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersById
                ]
            ]
        ]);

        // Assert query orders by given attribute
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    data {
                        id
                    }
                }
            }
        ', [
            'where' => [
                'orderBy' => 'first_name',
            ]
        ])->assertJson([
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

        // otherClassification is the higher one in the same group
        $otherClassification = Classification::factory()->create([
            'group' => 'ZZ',
            'level' => 2,
            'min_salary' => 65000,
            'max_salary' => 74999,
        ]);

        // *** first make three users in the right pool - 1 has an exact classification match, 1 has a salary to classification match, 1 has no match

        // Attach new user in the pool with the desired classification
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function($user) use ($myClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($myClassification);
            })->create([
                'expected_salary' => []
            ]),
            'pool_id' => $myPool->id
        ]);

        // Attach new user in the pool that overlaps the expected salary range and has a matching class group (but not level).
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function($user) use ($otherClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($otherClassification);
            })->create([
                'expected_salary' => ['_60_69K']
            ]),
            'pool_id' => $myPool->id
        ]);

        // Attach new user in the pool that is over the expected salary range and has a matching class group (but not level).
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function($user) use ($otherClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($otherClassification);
            })->create([
                'expected_salary' => ['_90_99K', '_100K_PLUS']
            ]),
            'pool_id' => $myPool->id
        ]);

        // *** now make the same three users in the wrong pool

        // Attach new user in the pool with the desired classification WRONG POOL
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function($user) use ($myClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($myClassification);
            })->create([
                'expected_salary' => []
            ]),
            'pool_id' => $otherPool->id
        ]);

        // Attach new user in the pool that overlaps the expected salary range and has a matching class group (but not level). WRONG POOL
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function($user) use ($otherClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($otherClassification);
            })->create([
                'expected_salary' => ['_60_69K']
            ]),
            'pool_id' => $otherPool->id
        ]);

        // Attach new user in the pool that is over the expected salary range and has a matching class group (but not level).  WRONG POOL
        PoolCandidate::factory()->create([
            'user_id' => User::factory()->afterCreating(function($user) use ($otherClassification) {
                $user->expectedClassifications()->delete();
                $user->expectedClassifications()->save($otherClassification);
            })->create([
                'expected_salary' => ['_90_99K', '_100K_PLUS']
            ]),
            'pool_id' => $otherPool->id
        ]);

        // Assert query with just pool filters will return all users in that pool
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$myPool->id]
                ]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with classification filter will return users in range and overlapping in that pool
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$myPool->id]
                ],
                'expectedClassifications' => [['group' => 'ZZ', 'level' => 1]]
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with unknown classification filter will return zero
        $this->graphQL(/** @lang Graphql */ '
            query getUsersPaginated($where: UserFilterAndOrderInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ', [
            'where' => [
                'pools' => [
                    'ids' => [$myPool->id]
                ],
                'expectedClassifications' => [['group' => 'UNKNOWN', 'level' => 1324234 ]],
            ]
        ])->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }
}
