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
            $table->uuid('id');
            $table->primary('id');
            $table->timestamps();
            $table->foreignId('classification_id');
            $table->foreignId('pool_id');
        });
        DB::statement('ALTER TABLE classification_pool ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
        Schema::create('essential_cmo_asset_pool', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->timestamps();
            $table->foreignId('cmo_asset_id');
            $table->foreignId('pool_id');
        });
        DB::statement('ALTER TABLE essential_cmo_asset_pool ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
        Schema::create('asset_cmo_asset_pool', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->timestamps();
            $table->foreignId('cmo_asset_id');
            $table->foreignId('pool_id');
        });
        DB::statement('ALTER TABLE asset_cmo_asset_pool ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
        Schema::create('operational_requirement_pool', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');
            $table->timestamps();
            $table->foreignId('operational_requirement_id');
            $table->foreignId('pool_id');
        });
        DB::statement('ALTER TABLE operational_requirement_pool ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
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
