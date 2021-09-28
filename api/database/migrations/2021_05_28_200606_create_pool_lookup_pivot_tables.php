<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreatePoolLookupPivotTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classification_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            $table->uuid('classification_id')->references('id')->on('classifications');
            $table->uuid('pool_id')->references('id')->on('pools');
            // $table->foreignId('classification_id');
            // $table->foreignId('pool_id');

        });
        DB::statement('ALTER TABLE classification_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            // $table->foreignId('cmo_asset_id');
            // $table->foreignId('pool_id');
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->uuid('pool_id')->references('id')->on('pools');
        });
        DB::statement('ALTER TABLE essential_cmo_asset_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            // $table->foreignId('cmo_asset_id');
            // $table->foreignId('pool_id');
            $table->uuid('cmo_asset_id')->references('id')->on('cmo_assets');
            $table->uuid('pool_id')->references('id')->on('pools');
        });
        DB::statement('ALTER TABLE asset_cmo_asset_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');
        Schema::create('operational_requirement_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id');
            $table->timestamps();
            // $table->foreignId('operational_requirement_id');
            // $table->foreignId('pool_id');
            $table->uuid('operational_requirement_id')->references('id')->on('operational_requirements');
            $table->uuid('pool_id')->references('id')->on('pools');
        });
        DB::statement('ALTER TABLE operational_requirement_pool ALTER COLUMN id SET DEFAULT gen_random_uuid();');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classification_pool');
        Schema::dropIfExists('essential_cmo_asset_pool');
        Schema::dropIfExists('asset_cmo_asset_pool');
        Schema::dropIfExists('operational_requirement_pool');
    }
}
