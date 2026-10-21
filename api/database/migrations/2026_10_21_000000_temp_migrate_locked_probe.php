<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * TEMPORARY: verifies migrate:locked on DEV (PR #18352). Roll back and delete before merging.
 *
 * Sleeps so the migration is still running while the other containers start: with the lock
 * they wait and then report "Nothing to migrate"; without it they'd try to create the table too.
 */
return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('migrate_locked_probe', function (Blueprint $table) {
            $table->id();
            $table->string('host');
            $table->timestamp('migrated_at')->useCurrent();
        });

        sleep(20);

        DB::table('migrate_locked_probe')->insert(['host' => gethostname()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('migrate_locked_probe');
    }
};
