<?php

use Database\Helpers\ApiEnums;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->string('request_status')->nullable(false)->default(ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_NEW);
        });
        DB::statement(
            <<<SQL
                UPDATE pool_candidate_search_requests
                    SET request_status =
                        case when done_at
                            is null then :new
                            else :done
                        end
            SQL,
            [
                'new' => ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_NEW,
                'done' => ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE
            ]
        );
        DB::statement(
            <<<SQL
                ALTER TABLE pool_candidate_search_requests
                    ADD COLUMN request_status_weight INT
                    GENERATED ALWAYS AS
                        (case
                            when request_status = 'NEW' then 10
                            when request_status = 'IN_PROGRESS' then 20
                            when request_status = 'WAITING' then 30
                            when request_status = 'DONE' then 40
                        end)
                STORED;
                SQL,
        );
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('done_at');
            $table->timestamp('status_changed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('request_status_weight');
            $table->dropColumn('request_status');
            $table->dropColumn('status_changed_at');
            $table->timestamp('done_at')->nullable();
        });
    }
};
