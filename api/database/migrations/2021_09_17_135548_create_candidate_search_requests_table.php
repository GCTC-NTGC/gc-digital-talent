<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidateSearchRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidate_search_requests', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("full_name");
            $table->string("email");
            $table->string('department_id')->references('id')->on('departments');
            $table->string("job_title");
            $table->text("additional_comments")->nullable();
            $table->text("pool_candidate_filter_id")->references('id')->on('pool_candidate_filters');
            $table->date("requested_date");
            $table->text("status");
            $table->text("admin_notes")->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('candidate_search_requests');
    }
}
