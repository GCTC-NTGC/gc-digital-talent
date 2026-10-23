<?php

use Illuminate\Database\Migrations\Migration;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('roles')->where('name', 'guest')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down, if it returns, RolePermissionSeeder should re-add it
    }
};
