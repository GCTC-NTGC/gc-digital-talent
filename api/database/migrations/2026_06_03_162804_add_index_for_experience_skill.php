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
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->index('experience_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experience_skill', function (Blueprint $table) {
            $table->dropIndex('experience_skill_experience_id_index');
        });
    }
};
