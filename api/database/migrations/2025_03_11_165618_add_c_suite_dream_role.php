<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('next_role_is_c_suite_role')->nullable();
            $table->boolean('career_objective_is_c_suite_role')->nullable();

            $table->string('next_role_c_suite_role_title')->nullable();
            $table->string('career_objective_c_suite_role_title')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('next_role_is_c_suite_role');
            $table->dropColumn('career_objective_is_c_suite_role');

            $table->dropColumn('next_role_c_suite_role_title');
            $table->dropColumn('career_objective_c_suite_role_title');
        });
    }
};
