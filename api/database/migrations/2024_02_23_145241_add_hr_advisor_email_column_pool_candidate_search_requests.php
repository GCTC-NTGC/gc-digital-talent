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
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->text('hr_advisor_email')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('hr_advisor_email');
        });
    }
};
