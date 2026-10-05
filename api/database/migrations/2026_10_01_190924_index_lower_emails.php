<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->rawIndex('LOWER(email)', 'users_lower_email_index');
            $table->rawIndex('LOWER(work_email)', 'users_lower_work_email_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_lower_email_index');
            $table->dropIndex('users_lower_work_email_index');
        });
    }
};
