<?php

use App\Models\User;
use App\Notifications\Test as TestNotification;
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

    protected $queryNotifications = /** GraphQL */ '
        query Notifications {
            me {
                id
                notifications {
                    id
                    readAt
                    ... on TestNotification {
                        data
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

        $this->user->notify(new TestNotification('test'));
        $this->notification = $this->user->unreadNotifications()->first();
    }

    public function testQueryNotification(): void
    {

        $this->actingAs($this->user, 'api')
            ->graphQL($this->queryNotifications)->assertJson([
                'data' => [
                    'me' => [
                        'notifications' => [
                            [
                                'id' => $this->notification->id,
                                'readAt' => null,
                                'data' => 'test',
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
                mutation unRadNotification($id: UUID!) {
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
        $this->user->notify(new TestNotification('one'));
        $this->user->notify(new TestNotification('two'));

        $response = $this->actingAs($this->user, 'api')
            ->graphQL($this->queryNotifications);

        // Confirm they exist as unread first
        $response->assertJsonFragment(['data' => 'one', 'readAt' => null]);
        $response->assertJsonFragment(['data' => 'two', 'readAt' => null]);

        $response = $this->actingAs($this->user, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation ReadAll {
                    markAllNotificationsAsRead {
                        id
                        readAt
                        ... on TestNotification {
                            data
                        }
                    }
                }
                ');

        $this->assertNotNull($response->json('data.markAllNotificationsAsRead.0.readAt'));
        $this->assertNotNull($response->json('data.markAllNotificationsAsRead.1.readAt'));
    }
}
