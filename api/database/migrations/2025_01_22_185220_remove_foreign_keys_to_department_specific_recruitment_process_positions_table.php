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
        Schema::table('department_specific_recruitment_process_positions', function (Blueprint $table) {
            $table->dropForeign('department_specific_recruitment_process_positions_department_sp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('department_specific_recruitment_process_positions', function (Blueprint $table) {
            $table->foreign(['department_specific_recruitment_process_form_id'], 'department_specific_recruitment_process_positions_department_sp')->references(['id'])->on('department_specific_recruitment_process_forms')->onUpdate('cascade')->onDelete('cascade');
        });

    }
};
