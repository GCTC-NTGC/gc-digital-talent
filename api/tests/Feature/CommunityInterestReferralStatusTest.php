<?php

namespace Tests\Feature;

use App\Enums\CommunityReferralStatus;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class CommunityInterestReferralStatusTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected Community $community;

    protected Community $otherCommunity;

    protected Classification $classification;

    protected CommunityInterest $communityInterest;

    protected User $owner;

    protected User $platformAdmin;

    protected User $communityRecruiter;

    protected User $communityAdmin;

    protected User $communityTalentCoordinator;

    protected User $otherCommunityRecruiter;

    protected User $processOperator;

    protected string $referralStatusQuery = <<<'GRAPHQL'
        query communityInterestsPaginated($where: CommunityInterestFilterInput) {
            communityInterestsPaginated(where: $where) {
                data {
                    communityInterest {
                        id
                        referralStatus {
                            status { value }
                            followUpDate
                            classification { id }
                            notes
                        }
                    }
                }
            }
        }
        GRAPHQL;

    protected string $updateMutation = <<<'GRAPHQL'
        mutation updateCommunityInterestReferralStatus($communityInterestReferral: UpdateCommunityInterestReferralStatusInput!) {
            updateCommunityInterestReferralStatus(communityInterestReferral: $communityInterestReferral) {
                id
                referralStatus {
                    status { value }
                    followUpDate
                    classification { id }
                    notes
                }
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create();
        $this->otherCommunity = Community::factory()->create();
        $this->classification = Classification::factory()->create();

        $this->owner = User::factory()->asApplicant()->withGovEmployeeProfile()->create();
        $this->communityInterest = CommunityInterest::factory()
            ->consented()
            ->for($this->owner)
            ->for($this->community)
            ->create();

        $this->platformAdmin = User::factory()->asAdmin()->create();
        $this->communityRecruiter = User::factory()->asCommunityRecruiter($this->community->id)->create();
        $this->communityAdmin = User::factory()->asCommunityAdmin($this->community->id)->create();
        $this->communityTalentCoordinator = User::factory()->asCommunityTalentCoordinator($this->community->id)->create();
        $this->otherCommunityRecruiter = User::factory()->asCommunityRecruiter($this->otherCommunity->id)->create();
        $this->processOperator = User::factory()
            ->asProcessOperator(Pool::factory()->create(['community_id' => $this->community->id])->id)
            ->create();
    }

    private function runReferralStatusQuery(User $actingAs): TestResponse
    {
        return $this->actingAs($actingAs, 'api')
            ->graphQL($this->referralStatusQuery, ['where' => []]);
    }

    private function runUpdate(User $actingAs, array $input, ?CommunityInterest $communityInterest = null): TestResponse
    {
        $communityInterest ??= $this->communityInterest;

        return $this->actingAs($actingAs, 'api')->graphQL($this->updateMutation, [
            'communityInterestReferral' => ['id' => $communityInterest->id, ...$input],
        ]);
    }

    private function availableForReferralInterest(): CommunityInterest
    {
        return CommunityInterest::factory()
            ->consented()
            ->availableForReferral($this->classification->id)
            ->for(User::factory()->asApplicant()->withGovEmployeeProfile()->create())
            ->for($this->community)
            ->create();
    }

    private function notReferredInput(): array
    {
        return [
            'status' => CommunityReferralStatus::NOT_REFERRED->name,
            'notes' => 'Not a fit for this request.',
        ];
    }

    private function availableForReferralInput(): array
    {
        return [
            'status' => CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name,
            'followUpDate' => '2026-09-01',
            'classification' => ['connect' => $this->classification->id],
        ];
    }

    public function testPlatformAdminCanViewReferralStatus(): void
    {
        $this->runReferralStatusQuery($this->platformAdmin)
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::NEW->name]]);
    }

    public function testCommunityRecruiterCanViewReferralStatus(): void
    {
        $this->runReferralStatusQuery($this->communityRecruiter)
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::NEW->name]]);
    }

    public function testCommunityAdminCanViewReferralStatus(): void
    {
        $this->runReferralStatusQuery($this->communityAdmin)
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::NEW->name]]);
    }

    public function testCommunityTalentCoordinatorCanViewReferralStatus(): void
    {
        $this->runReferralStatusQuery($this->communityTalentCoordinator)
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::NEW->name]]);
    }

    public function testOwnerCannotViewOwnReferralStatus(): void
    {
        $this->runReferralStatusQuery($this->owner)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testProcessOperatorCannotViewReferralStatus(): void
    {
        $this->runReferralStatusQuery($this->processOperator)
            ->assertJsonMissing(['status' => ['value' => CommunityReferralStatus::NEW->name]]);
    }

    public function testCommunityRecruiterCanUpdateReferralStatus(): void
    {
        $this->runUpdate($this->communityRecruiter, $this->availableForReferralInput())
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name]])
            ->assertJsonFragment(['classification' => ['id' => $this->classification->id]]);
    }

    public function testCommunityAdminCanUpdateReferralStatus(): void
    {
        $this->runUpdate($this->communityAdmin, $this->notReferredInput())
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::NOT_REFERRED->name]]);
    }

    public function testCommunityTalentCoordinatorCanUpdateReferralStatus(): void
    {
        $this->runUpdate($this->communityTalentCoordinator, $this->notReferredInput())
            ->assertJsonFragment(['status' => ['value' => CommunityReferralStatus::NOT_REFERRED->name]]);
    }

    public function testPlatformAdminCannotUpdateReferralStatus(): void
    {
        $this->runUpdate($this->platformAdmin, $this->notReferredInput())
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testRecruiterOfAnotherCommunityCannotUpdateReferralStatus(): void
    {
        $this->runUpdate($this->otherCommunityRecruiter, $this->notReferredInput())
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testOwnerCannotUpdateOwnReferralStatus(): void
    {
        $this->runUpdate($this->owner, $this->notReferredInput())
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testFollowUpDateIsRequiredForPendingStatus(): void
    {
        $this->runUpdate($this->communityRecruiter, ['status' => CommunityReferralStatus::PENDING->name])
            ->assertGraphQLValidationError(
                'communityInterestReferral.followUpDate',
                'The community interest referral.follow up date field is required.'
            );
    }

    public function testFollowUpDateIsRequiredForAvailableForReferralStatus(): void
    {
        $this->runUpdate($this->communityRecruiter, [
            'status' => CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name,
            'classification' => ['connect' => $this->classification->id],
        ])
            ->assertGraphQLValidationError(
                'communityInterestReferral.followUpDate',
                'The community interest referral.follow up date field is required.'
            );
    }

    public function testFollowUpDateIsNotRequiredForNotReferredStatus(): void
    {
        $this->runUpdate($this->communityRecruiter, $this->notReferredInput())
            ->assertGraphQLValidationPasses();
    }

    public function testClassificationIsRequiredForAvailableForReferralStatus(): void
    {
        $this->runUpdate($this->communityRecruiter, [
            'status' => CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name,
            'followUpDate' => '2026-09-01',
        ])
            ->assertGraphQLValidationError(
                'communityInterestReferral.classification.connect',
                'The community interest referral.classification.connect field is required.'
            );
    }

    public function testClassificationMustExist(): void
    {
        $this->runUpdate($this->communityRecruiter, [
            'status' => CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name,
            'followUpDate' => '2026-09-01',
            'classification' => ['connect' => Str::uuid()->toString()],
        ])
            ->assertGraphQLValidationError(
                'communityInterestReferral.classification.connect',
                'The selected community interest referral.classification.connect is invalid.'
            );
    }

    public function testPendingStatusClearsTheReferralClassification(): void
    {
        $interest = $this->availableForReferralInterest();

        $this->runUpdate($this->communityRecruiter, [
            'status' => CommunityReferralStatus::PENDING->name,
            'followUpDate' => '2026-09-01',
        ], $interest);

        $this->assertNull($interest->fresh()->referral_classification_id);
    }

    public function testNotReferredStatusClearsTheReferralClassificationAndFollowUpDate(): void
    {
        $interest = $this->availableForReferralInterest();

        $this->runUpdate($this->communityRecruiter, $this->notReferredInput(), $interest);

        $updated = $interest->fresh();
        $this->assertNull($updated->referral_classification_id);
        $this->assertNull($updated->referral_follow_up_date);
    }

    public function testNotesAreRequiredForNotReferredStatus(): void
    {
        $this->runUpdate($this->communityRecruiter, ['status' => CommunityReferralStatus::NOT_REFERRED->name])
            ->assertGraphQLValidationError(
                'communityInterestReferral.notes',
                'The community interest referral.notes field is required.'
            );
    }
}
