<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('classification_id');
            $table->foreign('classification_id')->references('id')->on('classifications');
        });

        DB::table('classification_pool')->lazyById()->each(
            function ($row) {
                DB::table('pools')
                    ->where('id', $row->pool_id)
                    ->update(['classification_id' => $row->classification_id]);
            }
        );

        Schema::dropIfExists('classification_pool');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('classification_pool', function (Blueprint $table) {
            $table->uuid('classification_id');
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->uuid('pool_id');
            $table->foreign('pool_id')->references('id')->on('pools');
        });

        DB::table('pools')
            ->whereNotNull('classification_id')
            ->lazyById()
            ->each(function ($row) {
                DB::table('classification_pool')->insert([
                    'classification_id' => $row->classification_id,
                    'pool_id' => $row->id,
                ]);
            });

        Schema::table('pool', function (Blueprint $table) {
            $table->dropForeign(['classification_id']);
            $table->dropColumn('classification_id');
        });
    }
};
