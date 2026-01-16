<?php

namespace App\Console\Commands;

use App\Models\Pool;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Sync process log
 *
 * Takes existing logs in the "default" log where the subject is a Pool
 * and copies them to the new "process" log to be used in process specific
 * activity log pages
 *
 * Should be ran anytime after releasing #15466
 * Can be ran multiple times because of the `AND NOT EXISTS` so duplicate logs are not copied
 * Delete once this has been ran in prod at least once
 */
class SyncProcessLog extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-process-log';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Syncs events related to processes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::insert(<<<'SQL'
            INSERT INTO activity_log (
                log_name,
                description,
                subject_type,
                subject_id,
                causer_type,
                causer_id,
                properties,
                created_at,
                updated_at,
                event,
                batch_uuid
                )
                SELECT
                    'process' AS log_name,
                    description,
                    subject_type,
                    subject_id,
                    causer_type,
                    causer_id,
                    properties,
                    created_at,
                    updated_at,
                    event,
                    batch_uuid
                FROM activity_log AS a
                WHERE
                a.log_name = 'default'
                AND a.subject_type = ?
                AND NOT EXISTS (
                    SELECT 1 FROM activity_log AS b
                    WHERE
                    b.log_name = 'process'
                    AND b.subject_type = a.subject_type
                    AND b.subject_id = a.subject_id
                    AND b.created_at = a.created_at
                    AND b.updated_at = a.updated_at
                );
        SQL, [Pool::class]);
    }
}
