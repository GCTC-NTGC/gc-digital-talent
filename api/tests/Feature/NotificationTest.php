<?php

use App\Enums\PoolCandidateStatus;
use App\Models\Pool;
use App\Models\User;
use App\Notifications\PoolCandidateStatusChanged;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $user;

    protected $notification;

    protected $originalStatus;

    protected $newStatus;

    protected $pool;

    protected $queryNotifications = /** GraphQL */ '
        query Notifications {
            notifications {
                data {
                    id
                    readAt
                    ... on PoolCandidateStatusChangedNotification {
                        oldStatus
                        newStatus
                    }
                }
            }
        }
    ';

    protected function setUp(): void
    {

        parent::setUp();

        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()
            ->asApplicant()
            ->create();

        $this->pool = Pool::factory()
            ->published()
            ->create();

        $this->originalStatus = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->newStatus = PoolCandidateStatus::PLACED_TERM->name;
        $this->user->notify(
            new PoolCandidateStatusChanged(
                $this->originalStatus,
                $this->newStatus,
                $this->pool->id,
                $this->pool->name
            )
        );

        $this->notification = $this->user->unreadNotifications()->first();
    }

    public function testQueryNotification(): void
    {

        $this->actingAs($this->user, 'api')
            ->graphQL($this->queryNotifications)->assertJson([
                'data' => [
                    'notifications' => [
                        'data' => [
                            [
                                'id' => $this->notification->id,
                                'readAt' => null,
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testUnreadNotification(): void
    {
        $response = $this->actingAs($this->user, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation unReadNotification($id: UUID!) {
                    markNotificationAsUnread(id: $id) {
                        id
                        readAt
                    }
                }
            ', ['id' => $this->notification->id]);

        $readAt = $response->json('data.markNotificationAsRead.readAt');

        $this->assertNull($readAt);
    }

    public function testDeleteNotification(): void
    {
        $this->actingAs($this->user, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation DeleteNotification($id: UUID!) {
                    deleteNotification(id: $id) {
                        id
                    }
                }
            ', ['id' => $this->notification->id])->assertJson([
                'data' => [
                    'deleteNotification' => [
                        'id' => $this->notification->id,
                    ],
                ],
            ]);

        $this->assertDatabaseMissing('notifications', ['id' => $this->notification->id]);
    }

    public function testReadAllNotifications(): void
    {

        $this->user->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::SCREENED_IN->name,
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                $this->pool->id,
                $this->pool->name
            )
        );
        $this->user->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                $this->pool->id,
                $this->pool->name
            )
        );

        $response = $this->actingAs($this->user, 'api')
            ->graphQL($this->queryNotifications);

        // Confirm they exist as unread first
        $response->assertJsonFragment([
            'oldStatus' => PoolCandidateStatus::SCREENED_IN->name,
            'readAt' => null,
        ]);
        $response->assertJsonFragment([
            'oldStatus' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            'readAt' => null,
        ]);

        $response = $this->actingAs($this->user, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation ReadAll {
                    markAllNotificationsAsRead {
                        id
                        readAt
                    }
                }
                ');

        $this->assertNotNull($response->json('data.markAllNotificationsAsRead.0.readAt'));
        $this->assertNotNull($response->json('data.markAllNotificationsAsRead.1.readAt'));
    }
}
