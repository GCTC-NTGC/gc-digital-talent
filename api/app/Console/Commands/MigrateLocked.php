<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/**
 * Runs migrations behind a Postgres advisory lock.
 *
 * Every container runs post_deployment.sh on startup (each instance of each slot, all on the same DB),
 * so several can try to migrate at once. Containers that don't get the lock wait for it, then find
 * nothing left to migrate, instead of running the same migration twice or starting on a half-migrated schema.
 */
class MigrateLocked extends Command
{
    // Arbitrary app-wide key; only needs to be the same for every container
    public const LOCK_KEY = 1834762811;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:locked
                            {--timeout=0 : Seconds to wait for another container to finish migrating (0 waits forever)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run migrations, waiting for any other container that is already migrating the same database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $connection = DB::connection();

        if ($connection->getDriverName() !== 'pgsql') {
            return Artisan::call('migrate', ['--force' => true], $this->getOutput());
        }

        // lock_timeout also applies to advisory lock waits
        $timeoutMs = max(0, (int) $this->option('timeout')) * 1000;
        $connection->statement("SET lock_timeout = $timeoutMs");

        try {
            $connection->select('SELECT pg_advisory_lock(?)', [self::LOCK_KEY]);
        } catch (QueryException $e) {
            $this->error('Timed out waiting for another container to finish migrating.');

            return self::FAILURE;
        } finally {
            $connection->statement('SET lock_timeout = 0');
        }

        try {
            // Same process, same connection: the lock is held for the whole migration
            return Artisan::call('migrate', ['--force' => true], $this->getOutput());
        } finally {
            $connection->select('SELECT pg_advisory_unlock(?)', [self::LOCK_KEY]);
        }
    }
}
