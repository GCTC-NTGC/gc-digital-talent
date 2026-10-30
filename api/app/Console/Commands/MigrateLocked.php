<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
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

    // SQLSTATE for lock_timeout expiring while waiting for a lock
    private const LOCK_NOT_AVAILABLE = '55P03';

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

        // lock_timeout also applies to advisory lock waits
        $timeoutMs = max(0, (int) $this->option('timeout')) * 1000;
        $connection->statement("SET lock_timeout = $timeoutMs");

        try {
            $connection->select('SELECT pg_advisory_lock(?)', [self::LOCK_KEY]);
        } catch (QueryException $e) {
            // Only a lock wait timeout means another container is migrating, anything else is a real error
            if ($e->getCode() !== self::LOCK_NOT_AVAILABLE) {
                throw $e;
            }

            $this->error('Timed out waiting for another container to finish migrating.');

            return self::FAILURE;
        } finally {
            $connection->statement('RESET lock_timeout');
        }

        try {
            // Same process, same session: the lock is held for the whole migration.
            // Session-level advisory locks need a direct connection, not a transaction-pooled one (e.g. PgBouncer).
            return $this->call('migrate', ['--force' => true]);
        } finally {
            try {
                $connection->select('SELECT pg_advisory_unlock(?)', [self::LOCK_KEY]);
            } catch (QueryException $e) {
                // Don't hide a migration error; Postgres releases the lock anyway when the session ends
                $this->warn('Could not release the migration lock: '.$e->getMessage());
            }
        }
    }
}
