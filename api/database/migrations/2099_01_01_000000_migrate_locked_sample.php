<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * TEMPORARY: sample for testing migrate:locked (PR #18352), reverted in the next commit.
 *
 * Sleeps so the migration is still running when a second process starts.
 * The row records which process actually ran it.
 */
return new class() extends Migration
{
    public function up(): void
    {
        Schema::create('migrate_locked_sample', function (Blueprint $table) {
            $table->id();
            $table->string('host');
            $table->integer('pid');
            $table->timestamp('migrated_at')->useCurrent();
        });

        sleep(15);

        DB::table('migrate_locked_sample')->insert(['host' => gethostname(), 'pid' => getmypid()]);
    }

    public function down(): void
    {
        Schema::dropIfExists('migrate_locked_sample');
    }
};
