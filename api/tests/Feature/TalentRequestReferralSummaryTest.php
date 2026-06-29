<?php

namespace Tests\Feature;

use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestReferralSummaryTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
        ]);

        $this->admin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
    }

    /**
     * Seed a user with a spread of tracked rows, each on its own talent request
     * (the factory auto-creates a distinct request per row): one not-referred,
     * one referred-pending, one selected, and N not-selected (OTHER).
     * referredCount should be 2 + $notSelectedCount; the breakdown one OTHER bucket.
     */
    private function seedReferralHistory(User $user, int $notSelectedCount): void
    {
        TalentRequestTrackedUser::factory()->notReferred()->for($user)->create();
        TalentRequestTrackedUser::factory()->referred()->for($user)->create();
        TalentRequestTrackedUser::factory()->selected()->for($user)->create();
        TalentRequestTrackedUser::factory()
            ->count($notSelectedCount)
            ->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER)
            ->for($user)
            ->create();
    }

    public function testUserAccessorAggregatesReferralHistory(): void
    {
        $user = User::factory()->create();
        $this->seedReferralHistory($user, notSelectedCount: 3);

        // a different user's rows must never leak into the aggregate
        $this->seedReferralHistory(User::factory()->create(), notSelectedCount: 2);

        $summary = $user->referralSummary;

        // referred (1) + selected (1) + not-selected (3) all have referral_decision REFERRED
        $this->assertSame(5, $summary['referredCount']);
        $this->assertSame(
            [['reason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name, 'count' => 3]],
            $summary['notSelectedReasons'],
        );
    }

    public function testUserAccessorEmptyHistory(): void
    {
        $summary = User::factory()->create()->referralSummary;

        $this->assertSame(0, $summary['referredCount']);
        $this->assertSame([], $summary['notSelectedReasons']);
    }

    public function testTrackedUserTypeResolvesUserWideSummary(): void
    {
        $request = TalentRequest::factory()->create();
        $user = User::factory()->create();

        // The row that surfaces in this request's list, plus more history on other requests.
        TalentRequestTrackedUser::factory()->selected()->for($user)->for($request)->create();
        TalentRequestTrackedUser::factory()->referred()->for($user)->create();
        TalentRequestTrackedUser::factory()
            ->count(3)
            ->notSelected(TalentRequestTrackedUserNotSelectedReason::OTHER)
            ->for($user)
            ->create();

        $query = <<<'GRAPHQL'
            query TrackedUserSummary($talentRequestId: UUID!) {
                talentRequestTrackedUsers(talentRequestId: $talentRequestId) {
                    data {
                        user { id }
                        referralSummary {
                            referredCount
                            notSelectedReasons { reason { value } count }
                        }
                    }
                }
            }
            GRAPHQL;

        $this->actingAs($this->admin, 'api')
            ->graphQL($query, ['talentRequestId' => $request->id])
            ->assertJsonCount(1, 'data.talentRequestTrackedUsers.data')
            ->assertJsonFragment([
                'referralSummary' => [
                    // selected (1) + referred (1) + not-selected (3), across all requests
                    'referredCount' => 5,
                    'notSelectedReasons' => [
                        ['reason' => ['value' => TalentRequestTrackedUserNotSelectedReason::OTHER->name], 'count' => 3],
                    ],
                ],
            ]);
    }

    public function testTalentRequestResultResolvesUserWideSummary(): void
    {
        $pool = Pool::factory()->candidatesAvailableInSearch()->create();
        $user = User::factory()->create();
        PoolCandidate::factory()->availableInSearch()->for($user)->for($pool)->create();

        $this->seedReferralHistory($user, notSelectedCount: 3);

        $query = <<<'GRAPHQL'
            query TalentRequestMatchSummary($where: TalentRequestMatchFilterInput) {
                talentRequestMatches(where: $where) {
                    data {
                        user { id }
                        referralSummary {
                            referredCount
                            notSelectedReasons { reason { value } count }
                        }
                    }
                }
            }
            GRAPHQL;

        $this->actingAs($this->admin, 'api')
            ->graphQL($query, ['where' => []])
            ->assertJsonPath('data.talentRequestMatches.data.0.user.id', $user->id)
            ->assertJsonFragment([
                'referralSummary' => [
                    'referredCount' => 5,
                    'notSelectedReasons' => [
                        ['reason' => ['value' => TalentRequestTrackedUserNotSelectedReason::OTHER->name], 'count' => 3],
                    ],
                ],
            ]);
    }
}
