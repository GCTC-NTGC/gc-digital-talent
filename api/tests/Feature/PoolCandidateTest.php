<?php

namespace Tests\Feature;

use App\Facades\Notify;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected $applicantUser;

    protected $communityRecruiterUser;

    protected $communityUser;

    protected $unAssociatedCommunityUser;

    protected $departmentUser;

    protected $unAssociatedDepartmentUser;

    protected $community;

    protected $pool;

    protected $department;

    protected PoolCandidate $candidate;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create();
        $this->department = Department::factory()->create();

        $this->pool = Pool::factory()->create([
            'community_id' => $this->community->id,
            'department_id' => $this->department->id,
        ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->communityRecruiterUser = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
                'sub' => 'community-recruiter-user@test.com',
            ]);

        $this->communityUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin@test.com',
                'sub' => 'community-admin@test.com',
            ]);

        $this->departmentUser = User::factory()
            ->asApplicant()
            ->asDepartmentAdmin($this->department->id)
            ->create([
                'email' => 'department-admin@test.com',
                'sub' => 'department-admin@test.com',
            ]);

        // Community and users not associated with the Pool we are testing against
        $unAssociatedCommunity = Community::factory()->create();
        $unAssociatedDepartment = Department::factory()->create();

        $this->unAssociatedCommunityUser = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($unAssociatedCommunity->id)
            ->create([
                'email' => 'unassociated-community-admin@test.com',
                'sub' => 'unassociated-community-admin@test.com',
            ]);
        $this->unAssociatedDepartmentUser = User::factory()
            ->asApplicant()
            ->asDepartmentAdmin($unAssociatedDepartment->id)
            ->create([
                'email' => 'unassociated-department-admin@test.com',
                'sub' => 'unassociated-department-admin@test.com',
            ]);

        $this->candidate = PoolCandidate::factory()
            ->submitted()
            ->for($this->applicantUser)
            ->for($this->pool)
            ->create();
    }

    public function testNotesAccess(): void
    {
        $basicQuery = /** @lang GraphQL */
        '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    id
                }
            }
         ';

        $notesQuery = /** @lang GraphQL */
        '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    notes
                }
            }
         ';

        // Assert community member can view notes
        $this->actingAs($this->communityUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $this->candidate->notes,
                    ],
                ],
            ]);

        // Assert community recruiter can view notes
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $this->candidate->notes,
                    ],
                ],
            ]);

        // Assert admin can view notes
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $this->candidate->notes,
                    ],
                ],
            ]);

        // Assert applicant can query candidate, but not access notes
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($basicQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'id' => $this->candidate->id,
                    ],
                ],
            ]);
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert an unassociated process operator cannot query candidate notes
        $this->actingAs($this->unAssociatedCommunityUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert only associated through pool->department department user can query notes
        $this->actingAs($this->departmentUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'notes' => $this->candidate->notes,
                    ],
                ],
            ]);
        $this->actingAs($this->unAssociatedDepartmentUser, 'api')
            ->graphQL($notesQuery, ['id' => $this->candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

    }

    public function testNotesUpdate(): void
    {
        $notesMutation = /** @lang GraphQL */
        '
            mutation UpdatePoolCandidateNotes($id: UUID!, $notes: String) {
                updatePoolCandidateNotes(id: $id, notes: $notes) {
                    id
                    notes
                }
            }
         ';

        $notesVariables = ['id' => $this->candidate->id, 'notes' => 'new notes'];

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->unAssociatedCommunityUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert community member can update notes
        $this->actingAs($this->communityUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertJson([
                'data' => [
                    'updatePoolCandidateNotes' => $notesVariables,
                ],
            ]);

        // Assert department user can update notes
        $this->actingAs($this->departmentUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertJson([
                'data' => [
                    'updatePoolCandidateNotes' => $notesVariables,
                ],
            ]);
        $this->actingAs($this->unAssociatedDepartmentUser, 'api')
            ->graphQL($notesMutation, $notesVariables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    /**
     * Status access permissions are similar to notes, except a candidate can see their own status
     */
    public function testStatusAccess(): void
    {

        $statusQuery = /** @lang GraphQL */
        '
            query poolCandidate($id: UUID!) {
                poolCandidate(id: $id) {
                    status { value }
                }
            }
         ';

        // Assert community member can view status
        $this->actingAs($this->communityUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $this->candidate->application_status,
                        ],
                    ],
                ],
            ]);

        // Assert community recruiter can view status
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $this->candidate->application_status,
                        ],
                    ],
                ],
            ]);

        // Assert admin can view status
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $this->candidate->application_status,
                        ],
                    ],
                ],
            ]);

        // Assert applicant can access status
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $this->candidate->application_status,
                        ],
                    ],
                ],
            ]);

        // Assert an unassociated process operator cannot query candidate status
        $this->actingAs($this->unAssociatedCommunityUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Assert only associated through pool->department department user can query status
        $this->actingAs($this->departmentUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => $this->candidate->application_status,
                        ],
                    ],
                ],
            ]);
        $this->actingAs($this->unAssociatedDepartmentUser, 'api')
            ->graphQL($statusQuery, ['id' => $this->candidate->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

    }

    public function testAccessingDeletedEducationExperienceIds()
    {
        $candidate = PoolCandidate::factory()
            ->availableInSearch()
            ->create();

        $expected = $candidate->education_requirement_experiences->map(fn ($exp) => $exp->id)->toArray();
        $candidate->education_requirement_experiences->each(fn ($exp) => $exp->delete());

        $this->assertEqualsCanonicalizing($expected, $candidate->education_requirement_experience_ids);

    }
}
