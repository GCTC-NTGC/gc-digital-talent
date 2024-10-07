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
        DB::table('generic_job_titles')
            ->where('key', 'EXECUTIVE_EX03')
            ->update(['key' => 'DIGITAL_LEADER_EX_03']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('generic_job_titles')
            ->where('key', 'DIGITAL_LEADER_EX_03')
            ->update(['key' => 'EXECUTIVE_EX03']);
    }
};
