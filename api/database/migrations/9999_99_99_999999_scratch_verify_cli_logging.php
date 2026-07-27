<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * TEMPORARY test fixture for PR #17457 — NOT meant to merge to main.
 *
 * Lets a reviewer check out this commit, run `LOG_CHANNEL=cli php artisan migrate`,
 * and see the resulting exception land in the new `cli` log channel
 * (storage/logs/laravel.log, plus Azure if AZURE_LOG_INGESTION_ENDPOINT is set).
 * The next commit removes this file again.
 */
return new class() extends Migration
{
    public function up(): void
    {
        DB::statement('SELECT * FROM this_table_does_not_exist_xyz');
    }

    public function down(): void
    {
    }
};
