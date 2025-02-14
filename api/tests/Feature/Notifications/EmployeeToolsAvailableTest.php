<?php

namespace Tests\Feature\Notifications;

use App\Models\Notification;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Console\Command;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class EmployeeToolsAvailableTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    // test database notification creation after running the artisan command
    public function testSendNotificationsEmployeeToolsAvailable(): void
    {
        $userToNotify = User::factory()
            ->create([
                'computed_is_gov_employee' => true,
                'work_email_verified_at' => config('constants.far_past_datetime'),
            ]);
        User::factory()
            ->create([
                'computed_is_gov_employee' => true,
                'work_email_verified_at' => config('constants.far_future_datetime'),
            ]);
        User::factory()
            ->create([
                'computed_is_gov_employee' => true,
                'work_email_verified_at' => null,
            ]);
        User::factory()
            ->create([
                'computed_is_gov_employee' => false,
                'work_email_verified_at' => config('constants.far_past_datetime'),
            ]);
        User::factory()
            ->create([
                'computed_is_gov_employee' => false,
                'work_email_verified_at' => null,
            ]);

        // command successful
        $exitCode = Artisan::call('send-notifications:employee-tools-available');
        assertEquals(Command::SUCCESS, $exitCode);

        // only one notification was sent
        $notifications = Notification::all();
        assertEquals(1, count($notifications));

        // created notification was to the expected user
        assertEquals($userToNotify->id, $notifications[0]->notifiable_id);
    }
}
