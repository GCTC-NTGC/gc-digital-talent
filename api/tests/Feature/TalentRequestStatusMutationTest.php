<?php

namespace Tests\Feature;

use App\Enums\TalentRequestCompleteDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestStatus;
use App\Models\Community;
use App\Models\TalentRequest;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestStatusMutationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected Community $community;

    protected User $recruiter;

    protected string $mutation = <<<'GRAPHQL'
        mutation UpdateStatus($id: ID!, $talentRequest: UpdateTalentRequestStatusInput!) {
            updateTalentRequestStatus(id: $id, talentRequest: $talentRequest) {
                talentRequestStatus { value }
                inProgressDetails { value }
                completionDetails { value }
                followUpDate
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
        ]);

        $this->community = Community::factory()->create();
        $this->recruiter = User::factory()
            ->asCommunityRecruiter([$this->community->id])
            ->create([
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);
    }

    public static function allStatusesProvider(): array
    {
        return [
            'from NEW' => [TalentRequestStatus::NEW->name],
            'from IN_PROGRESS' => [TalentRequestStatus::IN_PROGRESS->name],
            'from COMPLETED' => [TalentRequestStatus::COMPLETED->name],
        ];
    }

    #[DataProvider('allStatusesProvider')]
    public function testTransitionToInProgressClearsCompleteDetails(string $fromStatus): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => $fromStatus,
            'completion_details' => TalentRequestCompleteDetail::HIRE_MADE->name,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::IN_PROGRESS->name,
                    'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
                ],
            ])
            ->assertJsonFragment([
                'talentRequestStatus' => ['value' => TalentRequestStatus::IN_PROGRESS->name],
                'inProgressDetails' => ['value' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name],
                'completionDetails' => null,
            ]);
    }

    #[DataProvider('allStatusesProvider')]
    public function testTransitionToClosedClearsInProgressDetailsAndFollowUpDate(string $fromStatus): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => $fromStatus,
            'in_progress_details' => TalentRequestInProgressDetail::TALENT_SENT->name,
            'follow_up_date' => '2026-07-01',
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::COMPLETED->name,
                    'completionDetails' => TalentRequestCompleteDetail::NO_LONGER_REQUIRED->name,
                ],
            ])
            ->assertJsonFragment([
                'talentRequestStatus' => ['value' => TalentRequestStatus::COMPLETED->name],
                'completionDetails' => ['value' => TalentRequestCompleteDetail::NO_LONGER_REQUIRED->name],
                'inProgressDetails' => null,
                'followUpDate' => null,
            ]);
    }

    public function testFollowUpDatePersistedWhenSettingInProgress(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::NEW->name,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::IN_PROGRESS->name,
                    'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
                    'followUpDate' => '2026-06-01',
                ],
            ])
            ->assertJsonFragment(['followUpDate' => '2026-06-01']);
    }

    public function testFollowUpDateClearedWhenOmitted(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
            'follow_up_date' => '2026-06-01',
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::IN_PROGRESS->name,
                    'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
                ],
            ])
            ->assertJsonFragment(['followUpDate' => null]);
    }

    public function testInProgressDetailsRequiredWhenSettingInProgress(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::NEW->name,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => ['status' => TalentRequestStatus::IN_PROGRESS->name],
            ])
            ->assertGraphQLValidationError(
                'talentRequest.inProgressDetails',
                'The inProgressDetails field is required when status is IN_PROGRESS.'
            );
    }

    public function testCompleteDetailsRequiredWhenSettingClosed(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => TalentRequestInProgressDetail::TALENT_SENT->name,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => ['status' => TalentRequestStatus::COMPLETED->name],
            ])
            ->assertGraphQLValidationError(
                'talentRequest.completionDetails',
                'The completionDetails field is required when status is COMPLETED.'
            );
    }

    #[DataProvider('allStatusesProvider')]
    public function testNewIsRejectedAsTargetStatus(string $fromStatus): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => $fromStatus,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => ['status' => TalentRequestStatus::NEW->name],
            ])
            ->assertGraphQLValidationError('talentRequest.status', 'The selected status is invalid.');

        $this->assertEquals($fromStatus, $request->fresh()->status);
    }

    public function testStatusChangedAtUpdatesOnStatusChange(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $past = CarbonImmutable::now()->subHour();

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::NEW->name,
            'status_changed_at' => $past,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::IN_PROGRESS->name,
                    'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
                ],
            ]);

        $this->assertTrue($request->fresh()->status_changed_at->isAfter($past));
    }

    public function testStatusChangedAtUpdatesOnDetailsChange(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $past = CarbonImmutable::now()->subHour();

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
            'status_changed_at' => $past,
        ]);

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::IN_PROGRESS->name,
                    'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
                ],
            ]);

        $this->assertTrue($request->fresh()->status_changed_at->isAfter($past));
    }

    public function testStatusChangedAtNotUpdatedWhenOnlyFollowUpDateChanges(): void
    {
        // TODO: unskip once TalentRequestPolicy is implemented (https://github.com/GCTC-NTGC/gc-digital-talent/issues/16874)
        $this->markTestSkipped('Requires TalentRequestPolicy (#16874)');

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
        ]);
        $originalChangedAt = $request->status_changed_at;

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->mutation, [
                'id' => $request->id,
                'talentRequest' => [
                    'status' => TalentRequestStatus::IN_PROGRESS->name,
                    'inProgressDetails' => TalentRequestInProgressDetail::DISCUSSION_ONGOING->name,
                    'followUpDate' => '2026-08-01',
                ],
            ]);

        $this->assertEquals($originalChangedAt, $request->fresh()->status_changed_at);
    }

    public function testUnauthenticatedCannotUpdateStatus(): void
    {
        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'status' => TalentRequestStatus::NEW->name,
        ]);

        $this->graphQL($this->mutation, [
            'id' => $request->id,
            'talentRequest' => [
                'status' => TalentRequestStatus::IN_PROGRESS->name,
                'inProgressDetails' => TalentRequestInProgressDetail::INITIAL_CONVERSATION->name,
            ],
        ])->assertGraphQLErrorMessage('Unauthenticated.');
    }
}
