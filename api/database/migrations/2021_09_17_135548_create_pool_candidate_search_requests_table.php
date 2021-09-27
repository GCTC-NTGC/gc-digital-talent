<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePoolCandidateSearchRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pool_candidate_search_requests', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->string("full_name");
            $table->string("email");
            $table->string('department_id')->references('id')->on('departments');
            $table->string("job_title");
            $table->text("additional_comments")->nullable();
            $table->uuid("pool_candidate_filter_id")->references('id')->on('pool_candidate_filters');
            $table->dateTime("requested_date");
            $table->string("status");
            $table->text("admin_notes")->nullable();
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE pool_candidate_search_requests ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pool_candidate_search_requests');
    }
}
