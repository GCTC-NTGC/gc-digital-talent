<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertTrue;

class ProtectedRequestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);
    }

    public function testCanUseLimitedQueryUnprotected()
    {
        // simulate a regular request context
        Config::set('lighthouse.route.name', 'graphql');

        // a limited query can be used in an unprotected request
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                query skills {
                    skills { id }
                }
            '
        )->assertJsonStructure([
            'data' => [
                'skills' => [
                    '*' => ['id'],
                ],
            ],
        ]);
    }

    public function testCanUseLimitedQueryProtected()
    {
        // simulate a regular request context
        Config::set('lighthouse.route.name', 'graphql-protected');

        // a limited query can be used in an unprotected request
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                query skills {
                    skills { id }
                }
            '
        )->assertJsonStructure([
            'data' => [
                'skills' => [
                    '*' => ['id'],
                ],
            ],
        ]);
    }

    public function testCanUsePrivilegedQueryProtected()
    {
        // simulate a regular request context
        Config::set('lighthouse.route.name', 'graphql-protected');

        // a limited query can be used in an unprotected request
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createClassification($classification: CreateClassificationInput!) {
                    createClassification(
                      classification: $classification
                    ) { id }
                  }
            ',
            [
                'classification' => [
                    'group' => 'AA',
                    'level' => 1,
                    'maxSalary' => 100,
                    'minSalary' => 1,
                    'name' => [
                        'en' => 'test en',
                        'fr' => 'test fr',
                    ],
                ],
            ]
        )->assertJsonStructure([
            'data' => [
                'createClassification' => ['id'],
            ],
        ]);
    }

    public function testCanNotUsePrivilegedQueryUnprotected()
    {
        // simulate a regular request context
        Config::set('lighthouse.route.name', 'graphql');

        // a privileged query can not be used in an unprotected request
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createClassification($classification: CreateClassificationInput!) {
                    createClassification(
                      classification: $classification
                    ) { id }
                  }
            ',
            [
                'classification' => [
                    'group' => 'AA',
                    'level' => 1,
                    'maxSalary' => 100,
                    'minSalary' => 1,
                    'name' => [
                        'en' => 'test en',
                        'fr' => 'test fr',
                    ],
                ],
            ]
        )->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCanUsePrivilegedQueryInUnroutedRequest()
    {
        // permission is not important, just that it's not available to guest, base, applicant
        assertTrue($this->adminUser->isAbleTo('view-any-user'));
    }
}
