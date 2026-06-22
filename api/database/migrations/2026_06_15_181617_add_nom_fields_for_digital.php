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
        Schema::table('talent_nominations', function (Blueprint $table) {
            $table->string('nine_box_performance')->nullable();
            $table->string('nine_box_leadership_potential')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('talent_nominations', function (Blueprint $table) {
            $table->dropColumn('nine_box_performance');
            $table->dropColumn('nine_box_leadership_potential');
        });
    }
};
