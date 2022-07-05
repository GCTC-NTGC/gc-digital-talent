<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateApplicantFiltersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicant_filters', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->boolean('has_diploma')->nullable(true);
            $table->boolean('has_disability')->nullable(true);
            $table->boolean('is_indigenous')->nullable(true);
            $table->boolean('is_visible_minority')->nullable(true);
            $table->boolean('is_woman')->nullable(true);
            $table->boolean('would_accept_temporary')->nullable(true);
            $table->string('language_ability')->nullable(true);
            $table->jsonb('location_preferences')->nullable(true);
            $table->jsonb('operational_requirements')->nullable(true);
        });
        DB::statement('ALTER TABLE applicant_filters ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('applicant_filter_classification', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('applicant_filter_id')->references('id')->on('applicant_filters')->nullable(false)->cascadeOnDelete();
            $table->uuid('classification_id')->references('id')->on('classifications')->nullable(false);
            $table->unique(['applicant_filter_id', 'classification_id']);
        });
        DB::statement('ALTER TABLE applicant_filter_classification ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('applicant_filter_skill', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('applicant_filter_id')->references('id')->on('applicant_filters')->nullable(false)->cascadeOnDelete();
            $table->uuid('skill_id')->references('id')->on('skills')->nullable(false);
            $table->unique(['applicant_filter_id', 'skill_id']);
        });
        DB::statement('ALTER TABLE applicant_filter_skill ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        Schema::create('applicant_filter_pool_records', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('applicant_filter_id')->references('id')->on('applicant_filters')->nullable(false)->cascadeOnDelete();
            $table->uuid('pool_id')->references('id')->on('pools')->nullable(false);
            $table->string('expiry_status')->nullable(true);
            $table->jsonb('pool_candidate_statuses')->nullable(true);

            $table->unique(['applicant_filter_id', 'pool_id']);
        });
        DB::statement('ALTER TABLE applicant_filter_pool_records ALTER COLUMN id SET DEFAULT gen_random_uuid();');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('applicant_filters');
        Schema::dropIfExists('applicant_filter_classification');
        Schema::dropIfExists('applicant_filter_skill');
        Schema::dropIfExists('applicant_filter_pool_records');
    }
}
