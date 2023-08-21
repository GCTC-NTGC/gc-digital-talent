<?php

use App\Models\User;
use App\Console\Commands\HardDeleteOldUsers;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HardDeleteOldUsersTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function testActiveUserIsNotDestroyed(): void
    {
        User::factory()->create();

        Artisan::call(HardDeleteOldUsers::class);

        $this->assertEquals(1, User::count());
    }

    public function testRecentlyDeletedUserIsNotDestroyed(): void
    {
        $deletedDate = Carbon::now()->subYears(4);
        User::factory()->create([
            'deleted_at' => $deletedDate
        ]);

        Artisan::call(HardDeleteOldUsers::class);

        $this->assertEquals(1, User::withTrashed()->count());
    }

    public function testOlderDeletedUserIsDestroyed(): void
    {
        $deletedDate = Carbon::now()->subYears(5);
        User::factory()->create([
            'deleted_at' => $deletedDate
        ]);

        Artisan::call(HardDeleteOldUsers::class);

        $this->assertEquals(0, User::withTrashed()->count());
    }
}
