<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
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

        DB::table('pool_candidates')
            ->where('referring', false)
            ->update([
                'pause_referrals_at' => DB::raw('NOW()'),
                'resume_referrals_at' => DB::raw('expiry_date'),
            ]);

        DB::table('pool_candidates')
            ->where('placement_type', 'PLACED_INDETERMINATE')
            ->update([
                'pause_referrals_at' => DB::raw('NOW()'),
                'pause_referrals_reason' => 'Successfully placed',
                'resume_referrals_at' => null,
            ]);
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
