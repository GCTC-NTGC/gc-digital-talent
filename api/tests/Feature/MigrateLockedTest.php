<?php

namespace Tests\Feature;

use App\Console\Commands\MigrateLocked;
use Illuminate\Database\Connection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MigrateLockedTest extends TestCase
{
    use RefreshDatabase;

    // A failed lock wait aborts the surrounding Postgres transaction, so don't wrap these tests in one
    protected $connectionsToTransact = [];

    private ?Connection $otherContainer = null;

    // A second DB session, standing in for another container starting at the same time
    private function otherContainer(): Connection
    {
        if (! $this->otherContainer) {
            config(['database.connections.other_container' => config('database.connections.'.config('database.default'))]);
            $this->otherContainer = DB::connection('other_container');
        }

        return $this->otherContainer;
    }

    private function tryLock(): bool
    {
        return (bool) $this->otherContainer()->selectOne('SELECT pg_try_advisory_lock(?) AS locked', [MigrateLocked::LOCK_KEY])->locked;
    }

    protected function tearDown(): void
    {
        $this->otherContainer?->select('SELECT pg_advisory_unlock_all()');
        DB::purge('other_container');
        parent::tearDown();
    }

    public function testMigratesAndReleasesTheLock(): void
    {
        $this->artisan('migrate:locked')
            ->expectsOutputToContain('Nothing to migrate')
            ->assertSuccessful();

        $this->assertTrue($this->tryLock(), 'Lock should be free once migrating is done');
    }

    public function testTimesOutWhileAnotherContainerIsMigrating(): void
    {
        $this->assertTrue($this->tryLock());

        $this->artisan('migrate:locked', ['--timeout' => 1])
            ->expectsOutputToContain('Timed out waiting for another container to finish migrating.')
            ->assertFailed();
    }
}
