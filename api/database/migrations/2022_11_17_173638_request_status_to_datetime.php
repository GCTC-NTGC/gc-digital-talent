<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RequestStatusToDatetime extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->timestamp('done_at')->nullable();
        });
        DB::statement("
            update pool_candidate_search_requests
                set done_at =
                    case status
                        when 'DONE' then coalesce(updated_at, TIMESTAMP 'now')
                        when 'PENDING' then null
                    end
        ");
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->string('status')->nullable();
        });
        DB::statement("
        update pool_candidate_search_requests
            set status =
                case
                  when done_at <= TIMESTAMP 'now' then 'DONE'
                  else 'PENDING'
                end
        ");
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('done_at');
        });
    }
}
