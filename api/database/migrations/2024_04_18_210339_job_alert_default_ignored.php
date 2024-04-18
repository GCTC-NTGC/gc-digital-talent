<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement(
            <<<'SQL'
            ALTER TABLE users
            ALTER COLUMN ignored_email_notifications
            SET DEFAULT '["JOB_ALERT"]'::jsonb
            SQL, []
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(
            <<<'SQL'
            ALTER TABLE users
            ALTER COLUMN ignored_email_notifications
            SET DEFAULT null
            SQL, []
        );
    }
};
