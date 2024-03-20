<?php

use App\Enums\NotificationFamily;
use App\Enums\PoolCandidateStatus;
use App\Models\Notification;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Notifications\PoolCandidateStatusChanged;
use Carbon\Carbon;
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

    protected $notification;

    protected $originalStatus;

    protected $newStatus;

    protected $pool;

    protected $candidateUser;

    protected $poolCandidate;

    protected $queryNotifications = /** GraphQL */ '
        query Notifications($where: NotificationFilterInput) {
            notifications(where: $where) {
                data {
                    id
                    readAt
                    ... on PoolCandidateStatusChangedNotification {
                        oldStatus
                        newStatus
                        poolCandidateId
                        poolName {
                            en
                            fr
                        }
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

        $this->pool = Pool::factory()
            ->published()
            ->create();

        $this->candidateUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'candidate-user@test.com',
                'sub' => 'candidate-user@test.com',
                'ignored_email_notifications' => null,
            ]);

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->pool->id,
        ]);

        $this->originalStatus = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->newStatus = PoolCandidateStatus::PLACED_TERM->name;
        $this->candidateUser->notify(
            new PoolCandidateStatusChanged(
                $this->originalStatus,
                $this->newStatus,
                $this->poolCandidate->id,
                $this->pool->name
            )
        );

        $this->notification = $this->candidateUser->unreadNotifications()->first();
    }

    public function testQueryNotification(): void
    {

        $this->actingAs($this->candidateUser, 'api')
            ->graphQL($this->queryNotifications)->assertJson([
                'data' => [
                    'notifications' => [
                        'data' => [
                            [
                                'id' => $this->notification->id,
                                'readAt' => null,
                                'oldStatus' => $this->originalStatus,
                                'newStatus' => $this->newStatus,
                                'poolCandidateId' => $this->poolCandidate->id,
                                'poolName' => [
                                    'en' => $this->pool->name['en'],
                                    'fr' => $this->pool->name['fr'],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function testReadNotificationMutation(): void
    {
        $response = $this->actingAs($this->candidateUser, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation readNotification($id: UUID!) {
                    markNotificationAsRead(id: $id) {
                        id
                        readAt
                    }
                }
            ', ['id' => $this->notification->id]);

        $readAt = $response->json('data.markNotificationAsRead.readAt');

        $this->assertNotNull($readAt);
    }

    public function testUnreadNotificationMutation(): void
    {
        $this->notification->markAsRead();
        $response = $this->actingAs($this->candidateUser, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation unReadNotification($id: UUID!) {
                    markNotificationAsUnread(id: $id) {
                        id
                        readAt
                    }
                }
            ', ['id' => $this->notification->id]);

        $readAt = $response->json('data.markNotificationAsUnread.readAt');

        $this->assertNull($readAt);
    }

    public function testDeleteNotification(): void
    {
        $this->actingAs($this->candidateUser, 'api')
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

        $notification = Notification::select('deleted_at')
            ->withTrashed()
            ->firstWhere('id', $this->notification->id);

        $this->assertNotNull($notification->deleted_at);
    }

    public function testReadAllNotifications(): void
    {

        $this->candidateUser->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::SCREENED_IN->name,
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                $this->poolCandidate->id,
                $this->pool->name
            )
        );
        $this->candidateUser->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                $this->poolCandidate->id,
                $this->pool->name
            )
        );

        $response = $this->actingAs($this->candidateUser, 'api')
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

        $response = $this->actingAs($this->candidateUser, 'api')
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

    public function testOnlyUnreadQuery()
    {
        $this->candidateUser->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                $this->poolCandidate->id,
                $this->pool->name
            )
        );

        $this->candidateUser->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::NEW_APPLICATION->name,
                PoolCandidateStatus::PLACED_CASUAL->name,
                $this->poolCandidate->id,
                $this->pool->name
            )
        );

        $this->candidateUser->notifications()->first()->markAsRead();

        $unreadNotifications = $this->candidateUser->unreadNotifications()->get()->toArray();
        $response = $this->actingAs($this->candidateUser, 'api')
            ->graphQL($this->queryNotifications, [
                'where' => [
                    'onlyUnread' => true,
                ],
            ]);

        $responseNotifications = $response->json('data.notifications.data');
        $this->assertCount(count($unreadNotifications), $responseNotifications);

        foreach ($responseNotifications as $shouldBeUnread) {
            $this->assertNull($shouldBeUnread['readAt']);
        }
    }

    public function testDateRangeFilter()
    {
        $this->candidateUser->notify(
            new PoolCandidateStatusChanged(
                PoolCandidateStatus::PLACED_INDETERMINATE->name,
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                $this->poolCandidate->id,
                $this->pool->name
            )
        );

        $pastDate = new Carbon(config('constants.past_date'));
        $this->candidateUser->notifications()->first()->update([
            'read_at' => $pastDate,
        ]);
        $this->candidateUser->unreadNotifications->markAsRead();

        $from = $pastDate->addDay();
        $response = $this->actingAs($this->candidateUser, 'api')
            ->graphQL($this->queryNotifications, [
                'where' => [
                    'readAt' => [
                        'from' => $from->toDateTimeString(),
                        'to' => Carbon::now()->toDateTimeString(),
                    ],
                ]]);

        $notifications = $this->candidateUser->notifications()->get()->toArray();

        $rangeResponse = $response->json('data.notifications.data');

        $this->assertCount(count($notifications) - 1, $rangeResponse);

        foreach ($rangeResponse as $shouldBeInRange) {
            $date = new Carbon($shouldBeInRange['readAt']);

            $this->assertTrue($date->gt($from));

        }
    }

    public function testIgnoredNotificationsMutation(): void
    {
        // Ignoring the SYSTEM_MESSAGE family is not allowed
        $response = $this->actingAs($this->candidateUser, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation updateIgnoredNotifications($id: UUID!, $ignoredEmailNotifications: [NotificationFamily]) {
                    updateIgnoredNotifications(id: $id, ignoredEmailNotifications: $ignoredEmailNotifications) {
                        id
                        ignoredEmailNotifications
                    }
                }
            ', ['id' => $this->candidateUser->id, 'ignoredEmailNotifications' => [NotificationFamily::SYSTEM_MESSAGE->name]])
            ->assertGraphQLValidationError('ignoredEmailNotifications.0', 'NotIgnorableNotificationFamily');

        // Other families can be ignored
        $response = $this->actingAs($this->candidateUser, 'api')
            ->graphQL(/** @lang GraphQL */ '
                mutation ignoreNotifications($id: UUID!, $ignoredEmailNotifications: [NotificationFamily]) {
                    updateIgnoredNotifications(id: $id, ignoredEmailNotifications: $ignoredEmailNotifications) {
                        id
                        ignoredEmailNotifications
                    }
                }
            ', [
                'id' => $this->candidateUser->id,
                'ignoredEmailNotifications' => [NotificationFamily::APPLICATION_UPDATE->name, NotificationFamily::JOB_ALERT->name],
            ]);

        $updatedIgnoreList = $response->json('data.updateIgnoredNotifications.ignoredEmailNotifications');

        $this->assertNotNull($updatedIgnoreList);
    }
}
