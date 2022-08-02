<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddApplicantFilterToRequests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidate_search_requests', function (Blueprint $table) {
            $table->uuid("pool_candidate_filter_id")->nullable(true)->change();
            $table->uuid("applicant_filter_id")->nullable(true);
            $table->foreign("applicant_filter_id")->references("id")->on("applicant_filters");
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
            $table->uuid("pool_candidate_filter_id")->nullable(false)->change();
            $table->dropColumn("applicant_filter_id");
        });
    }
}
