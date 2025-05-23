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
        Schema::create('team_department', function (Blueprint $table) {
            $table->foreignUuid('team_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignUuid('department_id')
                ->constrained()
                ->onDelete('cascade');
        });
    }
};
