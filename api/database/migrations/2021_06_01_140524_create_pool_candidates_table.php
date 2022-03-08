<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreatePoolCandidatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pool_candidates', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->string('cmo_identifier')->nullable(true);
            $table->date('expiry_date')->nullable(true);

            $table->boolean('is_woman')->nullable(true);
            $table->boolean('has_disability')->nullable(true);
            $table->boolean('is_indigenous')->nullable(true);
            $table->boolean('is_visible_minority')->nullable(true);

            $table->boolean('has_diploma')->nullable(true);
            $table->string('language_ability')->nullable(true);
            $table->jsonb('location_preferences')->nullable(true);
            $table->jsonb('expected_salary')->nullable(true);
            $table->string('pool_candidate_status')->nullable(true);
            $table->uuid('pool_id')->references('id')->on('pools')->nullable(false);
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
        });
        DB::statement('ALTER TABLE pool_candidates ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('operational_requirement_pool_candidate', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_id')->references('id')->on('pool_candidates')->nullable(false);
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements')->nullable(false);
        });
        DB::statement('ALTER TABLE operational_requirement_pool_candidate ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('classification_pool_candidate', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_id')->references('id')->on('pool_candidates')->nullable(false);
            $table->uuid('classification_id')->references('id')->on('classifications')->nullable(false);
        });
        DB::statement('ALTER TABLE classification_pool_candidate ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('cmo_asset_pool_candidate', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_id')->references('id')->on('pool_candidates')->nullable(false);
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets')->nullable(false);
        });
        DB::statement('ALTER TABLE cmo_asset_pool_candidate ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pool_candidates');
        Schema::dropIfExists('operational_requirement_pool_candidate');
        Schema::dropIfExists('classification_pool_candidate');
        Schema::dropIfExists('cmo_asset_pool_candidate');
    }
}
