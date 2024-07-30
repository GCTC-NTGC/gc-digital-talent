<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use App\Notifications\Test;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertCount;
use function PHPUnit\Framework\assertEquals;

class NotificationAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected $user1;

    protected $user2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
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

    // a guest should get no notifications
    public function testGuest(): void
    {
        Auth::shouldReceive('user')
            ->andReturn(null);

        $notifications = Notification::authorizedToView()->get();
        assertCount(0, $notifications);
    }

    // an applicant should get just their own notifications
    public function testQueryApplicant(): void
    {
        Auth::shouldReceive('user')
            ->andReturn($this->user1);

        $notifications = Notification::authorizedToView()->get();
        assertCount(1, $notifications);
        assertEquals('Notification1', $notifications[0]->name);
    }
}
