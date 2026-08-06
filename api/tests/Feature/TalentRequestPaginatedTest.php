<?php

namespace Tests\Feature;

use App\Enums\TalentRequestStatus;
use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\TalentRequest;
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

class TalentRequestPaginatedTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected $communityRecruiter;

    protected $applicant;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(DepartmentSeeder::class);
        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
        $community = Community::factory()->create();
        $this->communityRecruiter = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create([
                'email' => 'community-recruiter@test.com',
                'sub' => 'community-recruiter@test.com',
            ]);
        $this->applicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);
    }

    protected $talentRequestsQuery =
        /** @lang GraphQL */
        '
        query talentRequests($where: TalentRequestInput){
            talentRequests(where: $where) {
                data
                    {
                        id
                        talentRequestStatus { value }
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
        TalentRequest::factory()->count(10)->create(['user_id' => null]);

        // assert guest can't see results
        $this->graphQL($this->talentRequestsQuery) // counts as guest
            ->assertGraphQLErrorMessage('Unauthenticated.');

        // applicant sees zero
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->talentRequestsQuery)
            ->assertJsonFragment(['count' => 0]);

        // assert community recruiter and admin can see results, paginated, and 10 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery)
            ->assertJsonFragment(['count' => 10]);
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->talentRequestsQuery)
            ->assertJsonFragment(['count' => 10]);
    }

    public function testTalentRequestStatusFiltering(): void
    {
        TalentRequest::factory()->count(2)->create([
            'status' => TalentRequestStatus::NEW->name,
        ]);
        TalentRequest::factory()->count(3)->create([
            'status' => TalentRequestStatus::COMPLETED->name,
        ]);
        TalentRequest::factory()->count(4)->create([
            'status' => TalentRequestStatus::IN_PROGRESS->name,
        ]);

        // no variables results in 9 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery)
            ->assertJsonFragment(['count' => 9]);

        // null where results in 9 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => null])
            ->assertJsonFragment(['count' => 9]);

        // talentRequestStatus null results in 9 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['talentRequestStatus' => null]])
            ->assertJsonFragment(['count' => 9]);

        // status new returns 2 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'talentRequestStatus' => [TalentRequestStatus::NEW->name],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 2]);

        // status completed returns 3 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'talentRequestStatus' => [TalentRequestStatus::COMPLETED->name],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 3]);

        // both statuses returns 5 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'talentRequestStatus' => [TalentRequestStatus::COMPLETED->name, TalentRequestStatus::NEW->name],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 5]);
    }

    public function testTalentRequestDepartmentsFiltering(): void
    {
        $departmentsSeeded = Department::all()->pluck('id')->toArray();
        TalentRequest::factory()->count(1)->create([
            'department_id' => $departmentsSeeded[0],
        ]);
        TalentRequest::factory()->count(2)->create([
            'department_id' => $departmentsSeeded[5],
        ]);

        // departments null results in 3 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['departments' => null]])
            ->assertJsonFragment(['count' => 3]);

        // department[3] passed in returns 0 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[3]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // department[0] passed in returns 1 result
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // department[0] and [1] passed in returns 1 result, OR matching
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0], $departmentsSeeded[1]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // department[0] and [5] passed in returns 3 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'departments' => [$departmentsSeeded[0], $departmentsSeeded[5]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testTalentRequestClassificationsFiltering(): void
    {
        $this->seed(ClassificationSeeder::class);
        $classificationsSeeded = Classification::all()->pluck('id')->toArray();

        $applicantFilter1 = ApplicantFilter::factory()->create();
        $applicantFilter1->qualifiedInClassifications()->sync([$classificationsSeeded[0]]);
        $applicantFilter2 = ApplicantFilter::factory()->create();
        $applicantFilter2->qualifiedInClassifications()->sync([$classificationsSeeded[2]]);

        TalentRequest::factory()->count(1)->create([
            'applicant_filter_id' => $applicantFilter1->id,
        ]);
        TalentRequest::factory()->count(2)->create([
            'applicant_filter_id' => $applicantFilter2->id,
        ]);

        // classifications null returns results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['classifications' => null]])
            ->assertJsonFragment(['count' => 3]);

        // classification[1] passed in returns 0 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[1]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // classification[0] passed in returns 1 result
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // classification[0] and [1] passed in returns 1 result, OR matching
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0], $classificationsSeeded[1]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // classification[0] and [2] passed in returns 3 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'classifications' => [$classificationsSeeded[0], $classificationsSeeded[2]],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testTalentRequestStreamsFiltering(): void
    {
        $stream1 = WorkStream::factory()->create();

        $applicantFilter1 = ApplicantFilter::factory()->withWorkStreams([$stream1])->create();

        $stream2 = WorkStream::factory()->create();

        $applicantFilter2 = ApplicantFilter::factory()->withWorkStreams([$stream2])->create();

        TalentRequest::factory()->count(1)->create([
            'applicant_filter_id' => $applicantFilter1->id,
        ]);
        TalentRequest::factory()->count(2)->create([
            'applicant_filter_id' => $applicantFilter2->id,
        ]);

        // streams null results in 3 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['workStreams' => null]])
            ->assertJsonFragment(['count' => 3]);

        $unattachedStream = WorkStream::factory()->create();

        // unattached stream passed in returns 0 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'workStreams' => [$unattachedStream->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 0]);

        // stream1 passed in returns 1 result
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'workStreams' => [$stream1->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // stream1 and unattached stream passed in returns 1 result, OR matching
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'workStreams' => [$stream1->id, $unattachedStream->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);

        // stream1 and stream2 passed in returns 3 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'workStreams' => [$stream1->id, $stream2->id],
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 3]);
    }

    public function testTalentRequestFullNameFiltering(): void
    {
        TalentRequest::factory()->count(3)->create([
            'full_name' => 'John Test',
        ]);
        TalentRequest::factory()->count(1)->create([
            'full_name' => 'Dale Monroe',
        ]);

        // fullName null returns 4 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['fullName' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial name returns one result correctly
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'fullName' => 'onRoe',
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testTalentRequestEmailFiltering(): void
    {
        TalentRequest::factory()->count(3)->create([
            'email' => 'JohnTest@test.com',
        ]);
        TalentRequest::factory()->count(1)->create([
            'email' => 'AdminTest@government.com',
        ]);

        // email null returns 4 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['email' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial email returns one result correctly
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'email' => '@GOVERNment',
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testTalentRequestJobTitleFiltering(): void
    {
        TalentRequest::factory()->count(3)->create([
            'job_title' => 'Tester',
        ]);
        TalentRequest::factory()->count(1)->create([
            'job_title' => 'Adminer',
        ]);

        // jobTitle null returns 4 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['jobTitle' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial job title returns one result correctly
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'jobTitle' => 'DmIn',
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testTalentRequestAdditionalCommentsFiltering(): void
    {
        TalentRequest::factory()->count(3)->create([
            'additional_comments' => 'Blah blah blah blah.',
        ]);
        TalentRequest::factory()->count(1)->create([
            'additional_comments' => 'Destined for great things.',
        ]);

        // additionalComments null returns 4 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['additionalComments' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial comments returns one result correctly
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
                [
                    'where' => [
                        'additionalComments' => 'DESTin',
                    ],
                ]
            )
            ->assertJsonFragment(['count' => 1]);
    }

    public function testTalentRequestAdminNotesFiltering(): void
    {
        TalentRequest::factory()->count(3)->create([
            'admin_notes' => 'A test request.',
        ]);
        TalentRequest::factory()->count(1)->create([
            'admin_notes' => 'An administrative request.',
        ]);

        // adminNotes null returns 4 results
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, ['where' => ['adminNotes' => null]])
            ->assertJsonFragment(['count' => 4]);

        // partial capitals and partial notes returns one result correctly
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL(
                $this->talentRequestsQuery,
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
        $communityRequest = TalentRequest::factory()->create([
            'community_id' => $community->id,
            'user_id' => null,
        ]);
        $otherCommunityRequest = TalentRequest::factory()->create([
            'community_id' => $otherCommunity->id,
            'user_id' => null,
        ]);
        $communityRecruiter = User::factory()
            ->asCommunityRecruiter([$community->id])
            ->create();

        // community recruiter only sees the request attached to their community
        $this->actingAs($communityRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery, [
                'where' => [],
            ])->assertJsonFragment(['count' => 1])
            ->assertJsonFragment(['id' => $communityRequest->id]);

        // non-admin sees zero
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->talentRequestsQuery, [
                'where' => [],
            ])->assertJsonFragment(['count' => 0]);
    }
}
