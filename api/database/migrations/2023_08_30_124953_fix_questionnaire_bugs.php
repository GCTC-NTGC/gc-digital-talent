<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Query\Expression;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            // split this column into two - both can be used simultaneously
            $table->dropColumn('requirement_work_location_specific'); // column isn't being used yet - no need to save data
            $table->string('requirement_work_location_gc_specific')->nullable();
            $table->string('requirement_work_location_offsite_specific')->nullable();

            // this is a one-to-many out to another table, not an enum array
            $table->dropColumn('personnel_requirements'); // column isn't being used yet - no need to save data

            $table->dropColumn('read_preamble'); // column isn't being used yet - no need to save data
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->dropColumn('requirement_work_location_gc_specific');
            $table->dropColumn('requirement_work_location_offsite_specific');
            $table->string('requirement_work_location_specific')->nullable();

            $table->jsonb('personnel_requirements')->default(new Expression('\'[]\'::jsonb'));

            $table->boolean('read_preamble')->nullable();
        });
    }
};
