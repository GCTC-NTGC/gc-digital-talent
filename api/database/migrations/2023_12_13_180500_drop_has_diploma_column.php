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
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('has_diploma');
        });
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->dropColumn('has_diploma');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('has_diploma');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->boolean('has_diploma')->nullable(true);
        });
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->boolean('has_diploma')->nullable(true);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('has_diploma')->nullable();
        });
    }
};
