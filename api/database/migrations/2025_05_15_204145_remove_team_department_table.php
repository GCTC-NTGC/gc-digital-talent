<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('team_department', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn('team_id');
            $table->dropColumn('department_id');
        });
        Schema::dropIfExists('team_department');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('team_department', function (Blueprint $table) {
            $table->uuid('team_id');
            $table->uuid('department_id');
            $table->foreign('team_id')->references('id')->on('teams');
            $table->foreign('department_id')->references('id')->on('departments');
        });
    }
};
