<?php

namespace Tests\Feature;

use Illuminate\Database\Connection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MigrateLockedTest extends TestCase
{
    use RefreshDatabase;

    // A failed lock wait aborts the surrounding Postgres transaction, so don't wrap these tests in one
    protected $connectionsToTransact = [];

    // Own key, so the tests don't depend on the default the deploy uses
    private const LOCK_KEY = 42;

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

    private function otherContainerTakesLock(): bool
    {
        return (bool) $this->otherContainer()->selectOne('SELECT pg_try_advisory_lock(?) AS locked', [self::LOCK_KEY])->locked;
    }

    protected function tearDown(): void
    {
        $this->otherContainer?->select('SELECT pg_advisory_unlock_all()');
        DB::purge('other_container');
        parent::tearDown();
    }

    public function testMigratesAndReleasesTheLock(): void
    {
        $this->artisan('migrate:locked', ['--key' => self::LOCK_KEY])
            ->expectsOutputToContain('Nothing to migrate')
            ->assertSuccessful();

        $this->assertTrue($this->otherContainerTakesLock(), 'Lock should be free once migrating is done');
    }

    public function testTimesOutWhileAnotherContainerIsMigrating(): void
    {
        $this->assertTrue($this->otherContainerTakesLock());

        $this->artisan('migrate:locked', ['--key' => self::LOCK_KEY, '--timeout' => 1])
            ->expectsOutputToContain('Timed out waiting for another container to finish migrating.')
            ->assertFailed();
    }
}
