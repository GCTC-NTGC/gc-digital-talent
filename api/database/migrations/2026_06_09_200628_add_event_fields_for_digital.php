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
        Schema::table('talent_nomination_events', function (Blueprint $table) {
            $table->boolean('include_nine_box')->default(false);
            $table->boolean('require_reference_for_advancement')->default(false);
            $table->jsonb('custom_instructions')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('talent_nomination_events', function (Blueprint $table) {
            $table->dropColumn('include_nine_box');
            $table->dropColumn('require_reference_for_advancement');
            $table->dropColumn('custom_instructions');
        });
    }
};
