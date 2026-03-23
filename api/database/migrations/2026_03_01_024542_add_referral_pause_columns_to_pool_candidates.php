<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->timestamp('pause_referrals_at')->nullable();
            $table->timestamp('resume_referrals_at')->nullable();
            $table->string('pause_referrals_reason')->nullable();
        });

        // Update the existing records
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET pause_referrals_at = NOW(), resume_referrals_at = expiry_date
            WHERE referring = TRUE;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('pause_referrals_at');
            $table->dropColumn('resume_referrals_at');
            $table->dropColumn('pause_referrals_reason');
        });
    }
};
