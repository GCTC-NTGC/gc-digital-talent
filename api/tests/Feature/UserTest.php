<?php

use App\Models\User;
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

    public function testFilterByLanguageAbility(): void
    {
        User::factory()->count(5)->create([
            'language_ability' => 'TEST'
        ]);

        // Create new LanguageAbility and attach to 3 new pool candidates.
        User::factory()->create([
            'language_ability' => 'FRENCH'
        ]);
        User::factory()->create([
            'language_ability' => 'ENGLISH'
        ]);
        User::factory()->create([
            'language_ability' => 'BILINGUAL'
        ]);

        // Assert query with no LanguageAbility filter will return all candidates
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

        // Assert query with ENGLISH filter will return correct candidate count
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

        // Assert query with FRENCH filter will return correct candidate count
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

        // Assert query with BILINGUAL filter will return correct candidate count
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
}
