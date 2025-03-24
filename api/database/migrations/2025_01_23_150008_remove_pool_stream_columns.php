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
        Schema::table('job_poster_templates', function (Blueprint $table) {
            $table->dropColumn('stream');
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->dropColumn('stream');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_poster_templates', function (Blueprint $table) {
            $table->string('stream')->nullable();
        });

        Schema::table('pools', function (Blueprint $table) {
            $table->string('stream')->nullable();
        });
    }
};
