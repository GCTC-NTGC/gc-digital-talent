<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn('team_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pools', function (Blueprint $table) {
            $table->uuid('team_id')->nullable();
            $table->foreign('team_id')
                ->references('id')
                ->on('teams')
                ->nullOnDelete();
        });
    }
};
