<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePoolCandidatateFilterEmploymentDuration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->boolean('would_accept_temporary')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidate_filters', function (Blueprint $table) {
            $table->dropColumn('would_accept_temporary');
        });
    }
}
