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
        DB::table('work_streams')
            ->where('key', 'SECURITY')
            ->update(['name->fr' => 'Sécurité']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('work_streams')
            ->where('key', 'SECURITY')
            ->update(['name->fr' => 'Sécurité de la TI']);
    }
};
