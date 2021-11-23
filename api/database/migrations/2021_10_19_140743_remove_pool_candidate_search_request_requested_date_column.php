<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemovePoolCandidateSearchRequestRequestedDateColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->dropColumn('requested_date');
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
            $table->dateTime("requested_date");
        });
    }
}
