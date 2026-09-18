<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\PlatformMetricSnapshot;
use App\Models\TalentRequest;
use App\Models\User;
use App\Services\Metrics\TalentRequestMetricsCalculator;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

/**
 * Covers authorization and shape of the platformMetrics query.
 *
 * The numbers themselves are covered by PlatformMetricsTest; this is about who
 * may read them and what a caller gets when there is nothing to read.
 */
class PlatformMetricsQueryTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $platformAdmin;

    protected User $baseUser;

    protected User $communityRecruiter;

    protected Community $community;

    protected const QUERY = /* @lang GraphQL */ '
        query PlatformMetrics {
            platformMetrics {
                computedAt
                talentRequests {
                    windowStart
                    submittedRequests {
                        overall {
                            submittedRequests
                            statusCompleted
                        }
                        byCommunity {
                            community { id name { en fr localized } }
                            values { submittedRequests }
                        }
                    }
                    fulfillmentRate {
                        overall { hires eligibleCompletions fulfillmentRatePct }
                    }
                    nonHireReasons {
                        overall { reasons { reason { value } candidates } }
                    }
                }
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        Notification::fake();

        $this->community = Community::factory()->create([
            'key' => 'digital',
            'name' => ['en' => 'Digital Community', 'fr' => 'Communauté numérique'],
        ]);

        $this->baseUser = User::create([
            'email' => 'base-user@test.com',
            'sub' => 'base-user@test.com',
        ]);
        $this->baseUser->syncRoles(['guest', 'base_user', 'applicant']);

        $this->platformAdmin = User::create([
            'email' => 'admin-user@test.com',
            'sub' => 'admin-user@test.com',
        ]);
        $this->platformAdmin->addRole('platform_admin');

        // Holds view-any-talentRequest for its community but not the
        // platform-wide metrics permission.
        $this->communityRecruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create(['email' => 'community-recruiter-user@test.com']);
    }

    public function testPlatformAdminCanReadMetrics(): void
    {
        $this->seedSnapshot();

        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL(self::QUERY)
            ->assertJson([
                'data' => [
                    'platformMetrics' => [
                        'talentRequests' => [
                            'windowStart' => TalentRequestMetricsCalculator::WINDOW_START,
                            'submittedRequests' => [
                                'overall' => [
                                    'submittedRequests' => 2,
                                    'statusCompleted' => 0,
                                ],
                                'byCommunity' => [
                                    [
                                        'community' => [
                                            'id' => $this->community->id,
                                            'name' => [
                                                'en' => 'Digital Community',
                                                'fr' => 'Communauté numérique',
                                                // Filled in at read time, not stored,
                                                // so it follows the request locale.
                                                'localized' => 'Digital Community',
                                            ],
                                        ],
                                        'values' => ['submittedRequests' => 2],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testUnauthorizedRolesCannotReadMetrics(): void
    {
        $this->seedSnapshot();

        foreach ([$this->baseUser, $this->communityRecruiter] as $user) {
            $this->actingAs($user, 'api')
                ->graphQL(self::QUERY)
                ->assertGraphQLErrorMessage('This action is unauthorized.');
        }
    }

    public function testGuestCannotReadMetrics(): void
    {
        $this->seedSnapshot();

        $this->graphQL(self::QUERY)->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function testReturnsNullBeforeTheFirstRun(): void
    {
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL(self::QUERY)
            ->assertJson(['data' => ['platformMetrics' => null]])
            ->assertGraphQLErrorFree();
    }

    /**
     * A snapshot written by code with a different shape must read as absent
     * rather than being handed to a client that cannot map it. This is a
     * recurring state, not a one-off: it happens after every shape change.
     */
    public function testReturnsNullWhenOnlySnapshotsOfAnUnknownShapeExist(): void
    {
        PlatformMetricSnapshot::create([
            'version' => PlatformMetricSnapshot::SHAPE_VERSION + 1,
            'computed_at' => Carbon::now(),
            'metrics' => ['talentRequests' => ['somethingElse' => true]],
        ]);

        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL(self::QUERY)
            ->assertJson(['data' => ['platformMetrics' => null]])
            ->assertGraphQLErrorFree();
    }

    /** Two requests in the window, so the payload has something to show. */
    private function seedSnapshot(): void
    {
        TalentRequest::factory()->count(2)->create([
            'community_id' => $this->community->id,
            'created_at' => Carbon::parse('2026-06-10 09:00:00'),
            'updated_at' => Carbon::parse('2026-06-10 09:00:00'),
        ]);

        $this->artisan('app:compute-platform-metrics')->assertSuccessful();
    }
}
