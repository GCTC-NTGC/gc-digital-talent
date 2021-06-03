<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
            $table->id();
            $table->timestamps();
            $table->foreignId('classification_id');
            $table->foreignId('pool_id');
        });
        Schema::create('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('cmo_asset_id');
            $table->foreignId('pool_id');
        });
        Schema::create('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('cmo_asset_id');
            $table->foreignId('pool_id');
        });
        Schema::create('operational_requirement_pool', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('operational_requirement_id');
            $table->foreignId('pool_id');
        });
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
