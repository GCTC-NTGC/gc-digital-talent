<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // remove constraints
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->dropUnique('asset_cmo_asset_pool_unique');
        });
        Schema::table('cmo_asset_user', function (Blueprint $table) {
            $table->dropUnique('cmo_asset_user_unique');
        });
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->dropUnique('essential_cmo_asset_pool_unique');
        });
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->dropForeign('essential_cmo_asset_pool_cmo_asset_id_foreign');
            $table->dropForeign('essential_cmo_asset_pool_pool_id_foreign');
        });
        Schema::table('cmo_assets', function (Blueprint $table) {
            $table->dropUnique('cmo_assets_key_unique');
        });
        Schema::table('cmo_asset_pool_candidate_filter', function (Blueprint $table) {
            $table->dropForeign('cmo_asset_pool_candidate_filter_pool_candidate_filter_id_foreign');
            $table->dropForeign('cmo_asset_pool_candidate_filter_cmo_asset_id_foreign');
        });
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->dropForeign('asset_cmo_asset_pool_cmo_asset_id_foreign');
            $table->dropForeign('asset_cmo_asset_pool_pool_id_foreign');
        });

         // remove tables
        Schema::dropIfExists('asset_cmo_asset_pool');
        Schema::dropIfExists('essential_cmo_asset_pool');
        Schema::dropIfExists('cmo_asset_pool_candidate_filter');
        Schema::dropIfExists('cmo_asset_user');
        Schema::dropIfExists('cmo_assets');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // create tables
        Schema::create('cmo_assets', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->string('key')->nullable(false);
            $table->jsonb('name')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
            $table->jsonb('description')->nullable(false)->default(json_encode(['en' => '', 'fr' => '']));
        });
        DB::statement('ALTER TABLE cmo_assets ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('cmo_asset_user', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('user_id')->references('id')->on('users')->nullable(false);
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets')->nullable(false);
        });
        DB::statement('ALTER TABLE cmo_asset_user ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('cmo_asset_pool_candidate_filter', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters')->nullable(false);
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets')->nullable(false);
        });
        DB::statement('ALTER TABLE cmo_asset_pool_candidate_filter ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->uuid('pool_id')->references('id')->on('pools');
        });
        DB::statement('ALTER TABLE essential_cmo_asset_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->uuid('pool_id')->references('id')->on('pools');
        });
        DB::statement('ALTER TABLE asset_cmo_asset_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        // create constraints
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('cmo_assets', function (Blueprint $table) {
            $table->unique('key');
        });
        Schema::table('cmo_asset_pool_candidate_filter', function (Blueprint $table) {
            $table->foreign('pool_candidate_filter_id')->references('id')->on('pool_candidate_filters');
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
        });
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->foreign('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->foreign('pool_id')->references('id')->on('pools');
        });
        Schema::table('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->unique(['cmo_asset_id', 'pool_id'], 'asset_cmo_asset_pool_unique');
        });
        Schema::table('cmo_asset_user', function (Blueprint $table) {
            $table->unique(['cmo_asset_id', 'user_id'], 'cmo_asset_user_unique');
        });
        Schema::table('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->unique(['cmo_asset_id', 'pool_id'], 'essential_cmo_asset_pool_unique');
        });
    }
};
