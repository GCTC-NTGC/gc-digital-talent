<?php

namespace Tests\Feature;

use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class PoolCandidateSearchRequestPaginatedTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected $adminUser;
    protected $requestResponder;
    protected $applicant;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();
        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
        $this->requestResponder = User::factory()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder@test.com',
                'sub' => 'request-responder@test.com',
            ]);
        $this->applicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);
    }

    protected $searchRequestQuery =
    /** @lang GraphQL */
    '
        query poolCandidateSearchRequestsPaginated($where: PoolCandidateSearchRequestInput){
            poolCandidateSearchRequestsPaginated(where: $where) {
                data
                    {
                        id
                        status
                    }
                paginatorInfo
                    {
                        count
                    }
            }
        }
    ';

    public function testQueryPermissions(): void
    {
        $this->seed(DepartmentSeeder::class);
        PoolCandidateSearchRequest::factory()->count(10)->create([]);

        // assert guest, admin, applicant can't see results
        $this->graphQL($this->searchRequestQuery) // counts as guest
            ->assertGraphQLErrorMessage('Unauthenticated.');
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // assert request responder sees results, paginated, and 10 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertJsonFragment(['count' => 10]);
    }

    public function testSearchRequestStatusFiltering(): void
    {
        $this->seed(DepartmentSeeder::class);
        PoolCandidateSearchRequest::factory()->count(4)->create([
            'done_at' => config('constants.past_date'),
        ]);
        PoolCandidateSearchRequest::factory()->count(6)->create([
            'done_at' => null,
        ]);

        // no variables results in 10 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertJsonFragment(['count' => 10]);

        // null where results in 10 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => null])
            ->assertJsonFragment(['count' => 10]);

        // status null results in 10 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['status' => null]])
            ->assertJsonFragment(['count' => 10]);

        // status pending results in 6 results, so done_at null
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_PENDING]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 6]);

        // status done results in 4 results, so done_at past date
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 4]);

        // both statuses results in 10 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE, ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_PENDING]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 10]);
    }
}
