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
            $table->datetime('removed_at')->nullable(true);
            $table->string('removal_reason')->nullable(true);
            $table->text('removal_reason_other')->nullable(true);
        });

        DB::statement("UPDATE pool_candidates
                    SET removed_at = now(),
                        removal_reason = 'REQUESTED_TO_BE_WITHDRAWN'
                    WHERE pool_candidate_status = 'SCREENED_OUT_NOT_INTERESTED'
                        OR pool_candidate_status = 'QUALIFIED_WITHDREW'");

        DB::statement("UPDATE pool_candidates
                    SET removed_at = now(),
                        removal_reason = 'NOT_RESPONSIVE'
                    WHERE pool_candidate_status = 'SCREENED_OUT_NOT_RESPONSIVE'");

        DB::statement("UPDATE pool_candidates
                    SET removed_at = now(),
                        removal_reason = 'OTHER',
                        removal_reason_other = 'Was \"QUALIFIED_UNAVAILABLE\"'
                    WHERE pool_candidate_status = 'QUALIFIED_UNAVAILABLE'");

        DB::statement("UPDATE pool_candidates
                    SET removed_at = now(),
                        removal_reason = 'OTHER',
                        removal_reason_other = 'Was \"REMOVED\"'
                    WHERE pool_candidate_status = 'REMOVED'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn([
                'removed_at',
                'removal_reason',
                'removal_reason_other',
            ]);
        });
    }
};
