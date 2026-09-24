<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Models\Community;
use App\Models\Pool;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class TriggerNewJobPostedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $this->seed(RolePermissionSeeder::class);
        Community::factory()->create();

        $this->regularUser = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'regularUser',
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);
    }

    // no notification when a draft pool is created
    public function testNothingSentForDraftPool(): void
    {

        $pool = Pool::factory()
            ->draft()
            ->create();

        $pool->name = [
            'en' => 'new name',
            'fr' => 'new name',
        ];
        $pool->save();

        $this->travel(1)->minutes();
        Artisan::call('send-notifications:pool-published');
        Notification::assertNothingSent();
    }

    // triggers a notification when the pool is published
    public function testNotifyWhenPublished(): void
    {
        $pool = Pool::factory()
            ->draft()
            ->create([
                'published_at' => null,
            ]);

        $pool->published_at = Carbon::now();
        $pool->save();

        $this->travel(1)->minutes();
        Artisan::call('send-notifications:pool-published');
        Notification::assertSentTimes(NewJobPosted::class, 1);
    }

    // no notification when the pool is hidden
    public function testNothingSentForOtherGroup(): void
    {
        $pool = Pool::factory()
            ->draft()
            ->create([
                'is_hidden' => true,
                'published_at' => null,
            ]);

        $pool->published_at = Carbon::now();
        $pool->save();

        $this->travel(1)->minutes();
        Artisan::call('send-notifications:pool-published');
        Notification::assertNothingSent();
    }

    // no notification when pool is closed or archived
    public function testNothingSentForClosedPool(): void
    {
        $pool = Pool::factory()
            ->published()
            ->create();

        $pool->closing_date = Carbon::now();
        $pool->save();

        $pool->archived_at = Carbon::now();
        $pool->save();

        $this->travel(1)->minutes();
        Artisan::call('send-notifications:pool-published');
        Notification::assertNothingSent();
    }
}
