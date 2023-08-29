<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->dropColumn([
                'is_woman',
                'has_disability',
                'is_indigenous',
                'is_visible_minority',
                'has_diploma',
                'language_ability',
                'location_preferences',
                'accepted_operational_requirements',
                'expected_salary',
            ]);
        });

        Schema::dropIfExists('classification_pool_candidate');
        Schema::dropIfExists('cmo_asset_pool_candidate');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pool_candidates', function (Blueprint $table) {
            $table->boolean('is_woman')->nullable()->default(null);
            $table->boolean('has_disability')->nullable()->default(null);
            $table->boolean('is_indigenous')->nullable()->default(null);
            $table->boolean('is_visible_minority')->nullable()->default(null);
            $table->boolean('has_diploma')->nullable()->default(null);
            $table->string('language_ability')->nullable()->default(null);
            $table->jsonb('location_preferences')->nullable()->default(null);
            $table->jsonb('accepted_operational_requirements')->nullable()->default(null);
            $table->jsonb('expected_salary')->nullable()->default(null);
        });

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
};
