<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
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
            $table->uuid('classification_id')->nullable();
            $table->foreign('classification_id')->references('id')->on('classifications');
        });

        DB::statement('
            UPDATE pools
            SET classification_id = (
                SELECT classification_id
                FROM classification_pool
                WHERE pool_id = pools.id
        );');

        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('classification_id')->nullable(false)->change();
        });

        Schema::dropIfExists('classification_pool');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('classification_pool', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->uuid('classification_id');
            $table->foreign('classification_id')->references('id')->on('classifications');
            $table->uuid('pool_id');
            $table->foreign('pool_id')->references('id')->on('pools');
        });

        DB::statement('
            INSERT INTO classification_pool (classification_id, pool_id)
            SELECT classification_id, id
            FROM pools
            WHERE classification_id IS NOT NULL;
        ');

        Schema::table('pools', function (Blueprint $table) {
            $table->dropForeign(['classification_id']);
            $table->dropColumn('classification_id');
        });
    }
};
