<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePoolCandidateFiltersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pool_candidate_filters', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->boolean('is_woman')->nullable(true);
            $table->boolean('has_diploma')->nullable(true);
            $table->boolean('has_disability')->nullable(true);
            $table->boolean('is_indigenous')->nullable(true);
            $table->boolean('is_visible_minority')->nullable(true);
            $table->string('language_ability')->nullable(true);
            $table->jsonb('work_regions')->nullable(true);
            $table->softDeletes();
        });
        DB::statement('ALTER TABLE pool_candidate_filters ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('operational_requirement_pool_candidate_filter', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements')->nullable(false);
        });
        DB::statement('ALTER TABLE operational_requirement_pool_candidate_filter ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('classification_pool_candidate_filter', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('classification_id')->references('id')->on('classifications')->nullable(false);
        });
        DB::statement('ALTER TABLE classification_pool_candidate_filter ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('cmo_asset_pool_candidate_filter', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets')->nullable(false);
        });
        DB::statement('ALTER TABLE cmo_asset_pool_candidate_filter ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('pool_pool_candidate_filter', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('pool_id')->references('id')->on('pools')->nullable(false);
        });
        DB::statement('ALTER TABLE pool_pool_candidate_filter ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pool_candidate_filters');
        Schema::dropIfExists('operational_requirement_pool_candidate_filter');
        Schema::dropIfExists('classification_pool_candidate_filter');
        Schema::dropIfExists('cmo_asset_pool_candidate_filter');
        Schema::dropIfExists('pool_pool_candidate_filter');
    }
}
