<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Query\Expression;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->jsonb('qualified_streams')->default(new Expression('\'[]\'::jsonb'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('qualified_streams');
        });
    }
};
