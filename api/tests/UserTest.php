<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequestsLumen;

class UserTest extends TestCase
{
    use DatabaseMigrations;
    use MakesGraphQLRequestsLumen;

    public function testCreateUserDefaultRoles()
    {
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
}
