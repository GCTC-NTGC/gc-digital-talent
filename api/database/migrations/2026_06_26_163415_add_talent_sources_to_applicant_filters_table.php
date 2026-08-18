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
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->jsonb('talent_sources')->nullable()->default(json_encode([]));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('talent_sources');
        });
    }
};
