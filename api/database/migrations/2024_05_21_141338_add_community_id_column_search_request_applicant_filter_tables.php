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

        $ATIP = DB::table('communities')
            ->select('id', 'key')
            ->where('key', 'atip')
            ->first();

        $digital = DB::table('communities')
            ->select('id', 'key')
            ->where('key', 'digital')
            ->first();

        DB::statement(<<<'SQL'
            UPDATE applicant_filters
            SET community_id = :community_id
        SQL,
            ['community_id' => $digital?->id]
        );

        DB::statement(<<<'SQL'
            UPDATE applicant_filters
            SET community_id = :community_id
            WHERE qualified_streams @> :stream
        SQL,
            [
                'community_id' => $ATIP?->id,
                'stream' => '"'.PoolStream::ACCESS_INFORMATION_PRIVACY->name.'"']
        );

        DB::statement(<<<'SQL'
            UPDATE pool_candidate_search_requests
            SET community_id = :community_id
        SQL, ['community_id' => $digital?->id]);

        DB::statement(<<<'SQL'
            UPDATE pool_candidate_search_requests
            SET community_id = af.community_id
            FROM applicant_filters af
            WHERE af.id = pool_candidate_search_requests.id
        SQL);

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
