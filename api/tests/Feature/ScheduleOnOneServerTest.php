<?php

namespace Tests\Feature;

use Illuminate\Console\Scheduling\CacheSchedulingMutex;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ScheduleOnOneServerTest extends TestCase
{
    use RefreshDatabase;

    // The database lock relies on a failed INSERT falling back to an UPDATE, which Postgres rejects inside a transaction.
    // schedule:run never runs inside one, so don't wrap these tests in one either.
    protected $connectionsToTransact = [];

    protected function tearDown(): void
    {
        DB::table('cache_locks')->delete();
        parent::tearDown();
    }

    // Each instance in a slot runs its own cron against the shared DB, so every event must be locked to one server
    public function testEveryScheduledEventRunsOnOneServer(): void
    {
        $events = $this->app->make(Kernel::class)->resolveConsoleSchedule()->events();

        $this->assertNotEmpty($events);
        foreach ($events as $event) {
            $this->assertTrue($event->onOneServer, "Scheduled event '{$event->command}' must use onOneServer()");
        }
    }

    public function testSecondServerCannotClaimTheSameRun(): void
    {
        $event = collect($this->app->make(Kernel::class)->resolveConsoleSchedule()->events())
            ->first(fn ($event) => str_contains($event->command, 'send-notifications:pool-published'));
        $this->assertNotNull($event, 'send-notifications:pool-published is no longer scheduled, pick another event');
        $time = Carbon::now();

        // A fresh mutex per "server", sharing only the configured schedule store
        $serverA = $this->app->make(CacheSchedulingMutex::class)->useStore(config('cache.schedule_store'));
        $serverB = $this->app->make(CacheSchedulingMutex::class)->useStore(config('cache.schedule_store'));

        $this->assertTrue($serverA->create($event, $time));
        $this->assertFalse($serverB->create($event, $time));
        $this->assertTrue($serverB->create($event, $time->copy()->addMinute()));
    }
}
