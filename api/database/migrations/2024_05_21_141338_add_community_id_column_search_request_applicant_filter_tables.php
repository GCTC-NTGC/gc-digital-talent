<?php

use App\Enums\PoolStream;
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
        // Start nullable until we populate existing requests/filters
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->uuid('community_id')->nullable();
            $table->foreign('community_id')->references('id')->on('communities');
        });

        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->uuid('community_id')->nullable();
            $table->foreign('community_id')->references('id')->on('communities');
        });

        $rows = DB::table('pool_candidate_search_requests')
            ->join('applicant_filters', 'pool_candidate_search_requests.applicant_filter_id', 'applicant_filters.id')
            ->select('pool_candidate_search_requests.id', 'applicant_filter_id', 'applicant_filters.qualified_streams')
            ->get();

        $ATIP = DB::table('communities')
            ->select('id', 'key')
            ->where('key', 'atip')
            ->first();

        $digital = DB::table('communities')
            ->select('id', 'key')
            ->where('key', 'digital')
            ->first();

        $rows->each(function ($row) use ($ATIP, $digital) {
            $streams = json_decode($row->qualified_streams);
            $communityId = $digital->id;

            if (in_array(PoolStream::ACCESS_INFORMATION_PRIVACY->name, $streams)) {
                $communityId = $ATIP->id;
            }

            DB::statement(<<<'SQL'
                    UPDATE  pool_candidate_search_requests
                    SET     community_id = ?
                    WHERE id = ?;
                SQL,
                [$communityId, $row->id]
            );

            DB::statement(<<<'SQL'
                    UPDATE  applicant_filters
                    SET     community_id = ?
                    WHERE id = ?;
                SQL,
                [$communityId, $row->applicant_filter_id]
            );
        });

        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->uuid('community_id')->nullable(false)->change();
        });

        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->uuid('community_id')->nullable(false)->change();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('community_id');
        });

        Schema::table('applicant_filters', function (Blueprint $table) {
            $table->dropColumn('community_id');
        });
    }
};
