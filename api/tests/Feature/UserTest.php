<?php

use App\Models\User;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequestsLumen;

class UserTest extends TestCase
{
    use DatabaseMigrations;
    use MakesGraphQLRequestsLumen;

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
}
