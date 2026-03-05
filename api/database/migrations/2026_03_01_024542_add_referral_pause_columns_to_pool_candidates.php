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
            $table->timestamp('referral_pause_at')->nullable();
            $table->timestamp('referral_unpause_at')->nullable();
            $table->string('referral_pause_reason')->nullable();
        });

        // Update the existing records
        DB::statement(<<<'SQL'
            UPDATE pool_candidates
            SET referral_pause_at = NOW(), referral_unpause_at = expiry_date
            WHERE referring = TRUE;
        SQL);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('referral_pause_at');
            $table->dropColumn('referral_unpause_at');
            $table->dropColumn('referral_pause_reason');
        });
    }
};
