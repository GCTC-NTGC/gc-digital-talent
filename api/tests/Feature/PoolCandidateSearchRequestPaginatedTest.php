<?php

namespace Tests\Feature;

use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use App\Models\Department;
use Database\Helpers\ApiEnums;
use Database\Seeders\ClassificationSeeder;
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
        $this->seed(DepartmentSeeder::class);
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
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'request_status' => ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_NEW,
        ]);
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'request_status' => ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE
        ]);
        PoolCandidateSearchRequest::factory()->count(4)->create([
            'request_status' => ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_WAITING
        ]);

        // no variables results in 9 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertJsonFragment(['count' => 9]);

        // null where results in 9 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => null])
            ->assertJsonFragment(['count' => 9]);

        // status null results in 9 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['status' => null]])
            ->assertJsonFragment(['count' => 9]);

        // status new returns 2 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_NEW]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 2]);

        // status done returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 3]);

        // both statuses returns 5 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE, ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_NEW]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 5]);
    }

    public function testSearchRequestDepartmentsFiltering(): void
    {
        $departmentsSeeded = Department::all()->pluck('id')->toArray();
        PoolCandidateSearchRequest::factory()->count(1)->create([
            'department_id' => $departmentsSeeded[0],
        ]);
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'department_id' => $departmentsSeeded[5],
        ]);

        // departments null results in 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['departments' => null]])
            ->assertJsonFragment(['count' => 3]);

        // department[3] passed in returns 0 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[3]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // department[0] passed in returns 1 result
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // department[0] and [1] passed in returns 1 result, OR matching
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0], $departmentsSeeded[1]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // department[0] and [5] passed in returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0], $departmentsSeeded[5]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testSearchRequestClassificationsFiltering(): void
    {
        $this->seed(ClassificationSeeder::class);
        $classificationsSeeded = Classification::all()->pluck('id')->toArray();

        $applicantFilter1 = ApplicantFilter::factory()->create();
        $applicantFilter1->qualifiedClassifications()->sync([$classificationsSeeded[0]]);
        $applicantFilter2 = ApplicantFilter::factory()->create();
        $applicantFilter2->qualifiedClassifications()->sync([$classificationsSeeded[2]]);

        PoolCandidateSearchRequest::factory()->count(1)->create([
            'applicant_filter_id' => $applicantFilter1->id,
        ]);
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'applicant_filter_id' => $applicantFilter2->id,
        ]);

        // classifications null returns results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['classifications' => null]])
            ->assertJsonFragment(['count' => 3]);

        // classification[1] passed in returns 0 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[1]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // classification[0] passed in returns 1 result
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // classification[0] and [1] passed in returns 1 result, OR matching
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0], $classificationsSeeded[1]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // classification[0] and [5] passed in returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0], $classificationsSeeded[2]]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testSearchRequestStreamsFiltering(): void
    {
        $applicantFilter1 = ApplicantFilter::factory()->create([
            'qualified_streams' => [ApiEnums::POOL_STREAM_SECURITY],
        ]);

        $applicantFilter2 = ApplicantFilter::factory()->create([
            'qualified_streams' => [ApiEnums::POOL_STREAM_BUSINESS_ADVISORY_SERVICES],
        ]);

        PoolCandidateSearchRequest::factory()->count(1)->create([
            'applicant_filter_id' => $applicantFilter1->id,
        ]);
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'applicant_filter_id' => $applicantFilter2->id,
        ]);

        // streams null results in 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['streams' => null]])
            ->assertJsonFragment(['count' => 3]);

        // infrastructure passed in returns 0 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'streams' => [ApiEnums::POOL_STREAM_INFRASTRUCTURE_OPERATIONS]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // security passed in returns 1 result
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'streams' => [ApiEnums::POOL_STREAM_SECURITY]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // security and infrastructure passed in returns 1 result, OR matching
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'streams' => [ApiEnums::POOL_STREAM_SECURITY, ApiEnums::POOL_STREAM_INFRASTRUCTURE_OPERATIONS]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // security and business passed in returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'streams' => [ApiEnums::POOL_STREAM_SECURITY, ApiEnums::POOL_STREAM_BUSINESS_ADVISORY_SERVICES]
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testSearchRequestFullNameFiltering(): void
    {
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'full_name' => 'John Test',
        ]);
        PoolCandidateSearchRequest::factory()->count(1)->create([
            'full_name' => 'Admin Test',
        ]);

        // fullName null returns 4 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['fullName' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial name returns one result correctly
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'fullName' => 'DmIn'
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testSearchRequestEmailFiltering(): void
    {
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'email' => 'JohnTest@test.com',
        ]);
        PoolCandidateSearchRequest::factory()->count(1)->create([
            'email' => 'AdminTest@government.com',
        ]);

        // email null returns 4 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['email' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial email returns one result correctly
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'email' => '@GOVERNment'
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testSearchRequestJobTitleFiltering(): void
    {
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'job_title' => 'Tester',
        ]);
        PoolCandidateSearchRequest::factory()->count(1)->create([
            'job_title' => 'Adminer',
        ]);

        // jobTitle null returns 4 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['jobTitle' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial job title returns one result correctly
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'jobTitle' => 'DmIn'
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testSearchRequestAdditionalCommentsFiltering(): void
    {
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'additional_comments' => 'Blah blah blah blah.',
        ]);
        PoolCandidateSearchRequest::factory()->count(1)->create([
            'additional_comments' => 'Destined for great things.',
        ]);

        // additionalComments null returns 4 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['additionalComments' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial comments returns one result correctly
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'additionalComments' => 'DESTin'
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testSearchRequestAdminNotesFiltering(): void
    {
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'admin_notes' => 'A test request.',
        ]);
        PoolCandidateSearchRequest::factory()->count(1)->create([
            'admin_notes' => 'An administrative request.',
        ]);

        // adminNotes null returns 4 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['adminNotes' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial notes returns one result correctly
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'adminNotes' => 'DmIn'
                    ]
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }
}
