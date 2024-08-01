<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use App\Notifications\Test;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class NotificationAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected $user1;

    protected $user2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user1 = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'user1@example.org',
                'enabled_email_notifications' => [],
                'enabled_in_app_notifications' => [],
            ]);
        $this->user1->notify(new Test('Notification1', 'database'));

        $this->user2 = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'user2@example.org',
                'enabled_email_notifications' => [],
                'enabled_in_app_notifications' => [],
            ]);

        $this->user2->notify(new Test('Notification2', 'database'));
    }

    // a guest should be able to view no notifications
    public function testViewAsGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        $notifications = Notification::authorizedToView()->get();
        assertEqualsCanonicalizing([], $notifications->toArray());
    }

    // an applicant should be able to view just their own notifications
    public function testViewAsApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->user1);

        $notifications = Notification::authorizedToView()->get()->pluck('name');
        assertEqualsCanonicalizing(['Notification1'], $notifications->toArray());
    }
}
