<?php

namespace Tests\Feature\Notifications;

use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class TriggerNewJobPostedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private User $adminUser;

    private User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $this->seed(RolePermissionSeeder::class);
        Team::factory()->create();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'sub' => 'adminUser',
                'ignored_email_notifications' => [],
                'ignored_in_app_notifications' => [],
            ]);
        $this->regularUser = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'regularUser',
                'ignored_email_notifications' => [],
                'ignored_in_app_notifications' => [],
            ]);
    }

    // no notification when an application is created or submitted
    public function testNothingSentForDraftPool(): void
    {

        $pool = Pool::factory()
            ->for($this->adminUser)
            ->draft()
            ->create();

        $pool->name = [
            'en' => 'new name',
            'fr' => 'new name',
        ];
        $pool->save();

        Notification::assertNothingSent();
    }

    // triggers a notification when an application is moved into a final decision status
    public function testNotifyWhenPublished(): void
    {
        $pool = Pool::factory()
            ->for($this->adminUser)
            ->draft()
            ->create([
                'published_at' => null,
            ]);

        $pool->published_at = Carbon::now();
        $pool->save();

        Notification::assertSentTimes(NewJobPosted::class, 2);
    }

    // no notification when an application is closed or archived
    public function testNothingSentForClosedPool(): void
    {
        $pool = Pool::factory()
            ->for($this->adminUser)
            ->published()
            ->create();

        $pool->closing_date = Carbon::now();
        $pool->save();

        $pool->archived_at = Carbon::now();
        $pool->save();

        Notification::assertNothingSent();
    }
}
