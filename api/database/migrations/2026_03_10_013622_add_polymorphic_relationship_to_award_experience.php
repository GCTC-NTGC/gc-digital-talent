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
        Schema::table('award_experiences', function (Blueprint $table) {
            $table->text('project_name')->nullable();
            $table->nullableUuidMorphs('related_experience');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('award_experiences', function (Blueprint $table) {
            $table->dropColumn('project_name');
            $table->dropMorphs('related_experience');
        });
    }
};
