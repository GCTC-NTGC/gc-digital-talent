<?php

use App\Enums\PoolCandidateStatus;
use Carbon\Carbon;
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
            $table->dateTime('placed_at')->nullable();

            $table->uuid('placed_department_id')->nullable();
            $table->foreign('placed_department_id')->references('id')->on('departments');
        });

        $placedStatuses = [
            PoolCandidateStatus::PLACED_CASUAL->name,
            PoolCandidateStatus::PLACED_INDETERMINATE->name,
            PoolCandidateStatus::PLACED_TENTATIVE->name,
            PoolCandidateStatus::PLACED_TERM->name,
        ];
        $timeNow = Carbon::now();

        DB::table('pool_candidates')
            ->whereIn('pool_candidate_status', $placedStatuses)
            ->whereNull('placed_at')
            ->update(['placed_at' => $timeNow]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn('placed_at');
            $table->dropColumn('placed_department_id');
        });
    }
};
