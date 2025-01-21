<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateSearchStatus;
use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use App\Models\WorkStream;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateSearchRequestPaginatedTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

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
                        status { value }
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

        // assert guest can't see results
        $this->graphQL($this->searchRequestQuery) // counts as guest
            ->assertGraphQLErrorMessage('Unauthenticated.');

        // applicant sees zero
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertJsonFragment(['count' => 0]);

        // assert request responder and admin can see results, paginated, and 10 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertJsonFragment(['count' => 10]);
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->searchRequestQuery)
            ->assertJsonFragment(['count' => 10]);
    }

    public function testSearchRequestStatusFiltering(): void
    {
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'request_status' => PoolCandidateSearchStatus::NEW->name,
        ]);
        PoolCandidateSearchRequest::factory()->count(3)->create([
            'request_status' => PoolCandidateSearchStatus::DONE->name,
        ]);
        PoolCandidateSearchRequest::factory()->count(4)->create([
            'request_status' => PoolCandidateSearchStatus::WAITING->name,
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
                        'status' => [PoolCandidateSearchStatus::NEW->name],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 2]);

        // status done returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [PoolCandidateSearchStatus::DONE->name],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 3]);

        // both statuses returns 5 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'status' => [PoolCandidateSearchStatus::DONE->name, PoolCandidateSearchStatus::NEW->name],
                    ],
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
                        'departments' => [$departmentsSeeded[3]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // department[0] passed in returns 1 result
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // department[0] and [1] passed in returns 1 result, OR matching
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0], $departmentsSeeded[1]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // department[0] and [5] passed in returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0], $departmentsSeeded[5]],
                    ],
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
                        'classifications' => [$classificationsSeeded[1]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // classification[0] passed in returns 1 result
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // classification[0] and [1] passed in returns 1 result, OR matching
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0], $classificationsSeeded[1]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // classification[0] and [5] passed in returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0], $classificationsSeeded[2]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testSearchRequestStreamsFiltering(): void
    {

        $stream1 = WorkStream::factory()->create();

        $applicantFilter1 = ApplicantFilter::factory()->withWorkStreams([$stream1])->create();

        $stream2 = WorkStream::factory()->create();

        $applicantFilter2 = ApplicantFilter::factory()->withWorkStreams([$stream2])->create();

        PoolCandidateSearchRequest::factory()->count(1)->create([
            'applicant_filter_id' => $applicantFilter1->id,
        ]);
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'applicant_filter_id' => $applicantFilter2->id,
        ]);

        // streams null results in 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, ['where' => ['workStreams' => null]])
            ->assertJsonFragment(['count' => 3]);

        $unattachedStream = WorkStream::factory()->create();

        // infrastructure passed in returns 0 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'workStreams' => [$unattachedStream->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // security passed in returns 1 result
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'workStreams' => [$stream1->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // security and infrastructure passed in returns 1 result, OR matching
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'workStreams' => [$stream1->id, $unattachedStream->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // security and business passed in returns 3 results
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL(
                $this->searchRequestQuery,
                [
                    'where' => [
                        'workStreams' => [$stream1->id, $stream2->id],
                    ],
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
            'full_name' => 'Dale Monroe',
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
                        'fullName' => 'onRoe',
                    ],
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
                        'email' => '@GOVERNment',
                    ],
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
                        'jobTitle' => 'DmIn',
                    ],
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
                        'additionalComments' => 'DESTin',
                    ],
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
                        'adminNotes' => 'DmIn',
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testScopeAuthorizedToView(): void
    {
        $community = Community::factory()->create();
        $otherCommunity = Community::factory()->create();
        $communityRequest = PoolCandidateSearchRequest::factory()->create([
            'community_id' => $community->id,
        ]);
        $otherCommunityRequest = PoolCandidateSearchRequest::factory()->create([
            'community_id' => $otherCommunity->id,
        ]);
        $communityRecruiter = User::factory()
            ->asCommunityRecruiter([$community->id])
            ->create();

        // request responder sees both requests
        $this->actingAs($this->requestResponder, 'api')
            ->graphQL($this->searchRequestQuery, [
                'where' => [],
            ])->assertJsonFragment(['count' => 2])
            ->assertJsonFragment(['id' => $communityRequest->id])
            ->assertJsonFragment(['id' => $otherCommunityRequest->id]);

        // community recruiter only sees the request attached to their community
        $this->actingAs($communityRecruiter, 'api')
            ->graphQL($this->searchRequestQuery, [
                'where' => [],
            ])->assertJsonFragment(['count' => 1])
            ->assertJsonFragment(['id' => $communityRequest->id]);

        // non-admin sees zero
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->searchRequestQuery, [
                'where' => [],
            ])->assertJsonFragment(['count' => 0]);
    }
}
