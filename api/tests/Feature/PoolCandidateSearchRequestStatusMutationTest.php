<?php

namespace Tests\Feature;

use App\Enums\TalentRequestClosedDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestStatus;
use App\Models\Community;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class PoolCandidateSearchRequestStatusMutationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected Community $community;

    protected User $recruiter;

    protected string $mutation = <<<'GRAPHQL'
        mutation UpdateStatus(
            $id: ID!
            $poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestStatusInput!
        ) {
            updatePoolCandidateSearchRequestStatus(
                id: $id
                poolCandidateSearchRequest: $poolCandidateSearchRequest
            ) {
                talentRequestStatus { value }
                inProgressDetails { value }
                closedDetails { value }
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(DepartmentSeeder::class);

        $this->community = Community::factory()->create();
        $this->recruiter = User::factory()
            ->asCommunityRecruiter([$this->community->id])
            ->create([
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);
    }

    private function makeRequest(
        string $status,
        ?string $inProgressDetails = null,
        ?string $closedDetails = null,
        ?string $followUpDate = null,
    ): PoolCandidateSearchRequest {
        return PoolCandidateSearchRequest::factory()->create([
            'community_id' => $this->community->id,
            'user_id' => null,
            'status' => $status,
            'in_progress_details' => $inProgressDetails,
            'closed_details' => $closedDetails,
            'follow_up_date' => $followUpDate,
        ]);
    }

    /** @param array<string, mixed> $input */
    private function runMutation(User $user, string $id, array $input): TestResponse
    {
        return $this->actingAs($user, 'api')
            ->graphQL($this->mutation, [
                'id' => $id,
                'poolCandidateSearchRequest' => $input,
            ]);
    }

    // -------------------------------------------------------------------------
    // Transitions to IN_PROGRESS
    // -------------------------------------------------------------------------

    public static function inProgressFromProvider(): array
    {
        return [
            'from_new' => [TalentRequestStatus::NEW->name],
            'from_in_progress' => [TalentRequestStatus::IN_PROGRESS->name],
            'from_complete' => [TalentRequestStatus::COMPLETE->name],
        ];
    }

    #[DataProvider('inProgressFromProvider')]
    public function testSetInProgressFrom(string $fromStatus): void
    {
        $closedDetails = $fromStatus === TalentRequestStatus::COMPLETE->name
            ? TalentRequestClosedDetail::HIRE_MADE->name
            : null;
        $request = $this->makeRequest($fromStatus, null, $closedDetails);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
        ])->assertJsonFragment([
            'talentRequestStatus' => ['value' => TalentRequestStatus::IN_PROGRESS->name],
            'inProgressDetails' => ['value' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name],
            'closedDetails' => null,
        ]);

        $this->assertNull($request->fresh()->closed_details);
    }

    public function testSetInProgressPersistsFollowUpDate(): void
    {
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
            'followUpDate' => '2026-06-01',
        ]);

        $this->assertEquals('2026-06-01', $request->fresh()->follow_up_date?->toDateString());
    }

    public function testClearFollowUpDateWithoutChangingStatus(): void
    {
        $request = $this->makeRequest(
            TalentRequestStatus::IN_PROGRESS->name,
            TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
            null,
            '2026-06-01',
        );

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
        ])->assertJsonFragment([
            'talentRequestStatus' => ['value' => TalentRequestStatus::IN_PROGRESS->name],
        ]);

        $this->assertNull($request->fresh()->follow_up_date);
    }

    public function testSetInProgressRequiresInProgressDetails(): void
    {
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
        ])->assertGraphQLValidationError('poolCandidateSearchRequest.inProgressDetails', 'The inProgressDetails field is required when status is IN_PROGRESS.');
    }

    // -------------------------------------------------------------------------
    // Transitions to CLOSED
    // -------------------------------------------------------------------------

    public static function closedFromProvider(): array
    {
        return [
            'from_new' => [TalentRequestStatus::NEW->name],
            'from_in_progress' => [TalentRequestStatus::IN_PROGRESS->name],
            'from_complete' => [TalentRequestStatus::COMPLETE->name],
        ];
    }

    #[DataProvider('closedFromProvider')]
    public function testSetClosedFrom(string $fromStatus): void
    {
        $inProgress = $fromStatus === TalentRequestStatus::IN_PROGRESS->name
            ? TalentRequestInProgressDetail::TALENT_SENT->name
            : null;
        $closed = $fromStatus === TalentRequestStatus::COMPLETE->name
            ? TalentRequestClosedDetail::HIRE_MADE->name
            : null;
        $request = $this->makeRequest($fromStatus, $inProgress, $closed, '2026-07-01');

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::COMPLETE->name,
            'closedDetails' => TalentRequestClosedDetail::NO_LONGER_REQUIRED->name,
        ])->assertJsonFragment([
            'talentRequestStatus' => ['value' => TalentRequestStatus::COMPLETE->name],
            'closedDetails' => ['value' => TalentRequestClosedDetail::NO_LONGER_REQUIRED->name],
            'inProgressDetails' => null,
        ]);

        $fresh = $request->fresh();
        $this->assertNull($fresh->in_progress_details);
        $this->assertNull($fresh->follow_up_date);
    }

    public function testClosedDetailsNullableWhenSettingInProgress(): void
    {
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
            'closedDetails' => null,
        ])->assertJsonFragment([
            'talentRequestStatus' => ['value' => TalentRequestStatus::IN_PROGRESS->name],
            'closedDetails' => null,
        ]);
    }

    public function testSetClosedRequiresClosedDetails(): void
    {
        $request = $this->makeRequest(
            TalentRequestStatus::IN_PROGRESS->name,
            TalentRequestInProgressDetail::TALENT_SENT->name,
        );

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::COMPLETE->name,
        ])->assertGraphQLValidationError('poolCandidateSearchRequest.closedDetails', 'The closedDetails field is required when status is CLOSED.');
    }

    public function testInProgressDetailsNullableWhenSettingClosed(): void
    {
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::COMPLETE->name,
            'closedDetails' => TalentRequestClosedDetail::NO_LONGER_REQUIRED->name,
            'inProgressDetails' => null,
        ])->assertJsonFragment([
            'talentRequestStatus' => ['value' => TalentRequestStatus::COMPLETE->name],
            'inProgressDetails' => null,
        ]);
    }

    // -------------------------------------------------------------------------
    // State machine: NEW is forbidden as a target status
    // -------------------------------------------------------------------------

    public static function newRejectedFromProvider(): array
    {
        return [
            'from_new' => [TalentRequestStatus::NEW->name],
            'from_in_progress' => [TalentRequestStatus::IN_PROGRESS->name],
            'from_complete' => [TalentRequestStatus::COMPLETE->name],
        ];
    }

    #[DataProvider('newRejectedFromProvider')]
    public function testSetNewIsRejected(string $fromStatus): void
    {
        $request = $this->makeRequest($fromStatus);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::NEW->name,
        ])->assertGraphQLValidationError('poolCandidateSearchRequest.status', 'The selected status is invalid.');

        $this->assertEquals($fromStatus, $request->fresh()->status);
    }

    // -------------------------------------------------------------------------
    // Authorization
    //
    // Policy (PoolCandidateSearchRequestPolicy::update):
    //   - grants access when user has update-any-searchRequest (no role has this)
    //   - grants access when user has update-team-searchRequest on the request's community team
    //
    // From rolepermission.php seeders:
    //   community_recruiter → searchRequest.team.[view, update, delete]
    //   community_admin     → searchRequest.team.[view, update, delete]
    //   platform_admin      → searchRequest.any.[view] only — cannot update
    //   applicant           → searchRequest.own.[view] only — cannot update
    // -------------------------------------------------------------------------

    public static function authorizedRoleProvider(): array
    {
        return [
            'community_recruiter' => ['community_recruiter'],
            'community_admin' => ['community_admin'],
        ];
    }

    #[DataProvider('authorizedRoleProvider')]
    public function testAuthorizedUsersCanSetStatus(string $role): void
    {
        $user = match ($role) {
            'community_recruiter' => User::factory()->asCommunityRecruiter([$this->community->id])->create(),
            'community_admin' => User::factory()->asCommunityAdmin([$this->community->id])->create(),
        };
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->runMutation($user, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
        ])->assertJsonFragment([
            'talentRequestStatus' => ['value' => TalentRequestStatus::IN_PROGRESS->name],
        ]);
    }

    public static function unauthorizedRoleProvider(): array
    {
        return [
            'applicant' => ['applicant'],
            'platform_admin' => ['platform_admin'],
            'recruiter_other_community' => ['recruiter_other_community'],
            'admin_other_community' => ['admin_other_community'],
        ];
    }

    #[DataProvider('unauthorizedRoleProvider')]
    public function testUnauthorizedUsersBlocked(string $role): void
    {
        $otherCommunity = Community::factory()->create();

        $user = match ($role) {
            'applicant' => User::factory()->asApplicant()->create(),
            'platform_admin' => User::factory()->asAdmin()->create(),
            'recruiter_other_community' => User::factory()->asCommunityRecruiter([$otherCommunity->id])->create(),
            'admin_other_community' => User::factory()->asCommunityAdmin([$otherCommunity->id])->create(),
        };
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->runMutation($user, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
        ])->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testUnauthenticatedCannotSetStatus(): void
    {
        $request = $this->makeRequest(TalentRequestStatus::NEW->name);

        $this->graphQL($this->mutation, [
            'id' => $request->id,
            'poolCandidateSearchRequest' => [
                'status' => TalentRequestStatus::IN_PROGRESS->name,
                'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
            ],
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }

    // -------------------------------------------------------------------------
    // request_status_changed_at tracking
    // -------------------------------------------------------------------------

    public function testRequestStatusChangedAtSetOnStatusChange(): void
    {
        $past = CarbonImmutable::now()->subHour();

        $request = PoolCandidateSearchRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::NEW->name,
            'request_status_changed_at' => $past,
        ]);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
        ]);

        $this->assertTrue(
            $request->fresh()->request_status_changed_at->isAfter($past),
            'request_status_changed_at should be updated when status changes'
        );
    }

    public function testRequestStatusChangedAtUpdatedOnDetailsChanged(): void
    {
        $past = CarbonImmutable::now()->subHour();

        $request = PoolCandidateSearchRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
            'request_status_changed_at' => $past,
        ]);

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
        ]);

        $this->assertTrue(
            $request->fresh()->request_status_changed_at->isAfter($past),
            'request_status_changed_at should be updated when inProgressDetails changes'
        );
    }

    public function testRequestStatusChangedAtNotUpdatedWhenOnlyFollowUpDateChanges(): void
    {
        $request = $this->makeRequest(
            TalentRequestStatus::IN_PROGRESS->name,
            TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
        );
        $originalChangedAt = $request->request_status_changed_at;

        $this->runMutation($this->recruiter, $request->id, [
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
            'followUpDate' => '2026-08-01',
        ]);

        $this->assertEquals($originalChangedAt, $request->fresh()->request_status_changed_at);
    }

    // -------------------------------------------------------------------------
    // Status weight ordering
    // -------------------------------------------------------------------------

    public function testStatusWeightOrdering(): void
    {
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::COMPLETE->name,
        ]);
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
        ]);
        PoolCandidateSearchRequest::factory()->count(2)->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::NEW->name,
        ]);

        $response = $this->actingAs($this->recruiter, 'api')
            ->graphQL(<<<'GRAPHQL'
                query {
                    poolCandidateSearchRequestsPaginated(first: 10, orderBy: [{ column: "status_weight", order: ASC }]) {
                        data { talentRequestStatus { value } }
                    }
                }
                GRAPHQL
            )
            ->assertSuccessful();

        $statuses = collect($response->json('data.poolCandidateSearchRequestsPaginated.data'))
            ->pluck('talentRequestStatus.value')
            ->values()
            ->all();

        $newIndexes = array_keys(array_filter($statuses, fn ($s) => $s === TalentRequestStatus::NEW->name));
        $inProgressIndexes = array_keys(array_filter($statuses, fn ($s) => $s === TalentRequestStatus::IN_PROGRESS->name));
        $closedIndexes = array_keys(array_filter($statuses, fn ($s) => $s === TalentRequestStatus::COMPLETE->name));

        $this->assertTrue(max($newIndexes) < min($inProgressIndexes), 'NEW rows should precede IN_PROGRESS rows');
        $this->assertTrue(max($inProgressIndexes) < min($closedIndexes), 'IN_PROGRESS rows should precede CLOSED rows');
    }
}
