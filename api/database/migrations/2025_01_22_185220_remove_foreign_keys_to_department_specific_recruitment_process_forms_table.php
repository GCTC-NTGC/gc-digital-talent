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
        Schema::table('department_specific_recruitment_process_forms', function (Blueprint $table) {
            $table->dropForeign('department_specific_recruitment_process_forms_department_id_for');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('department_specific_recruitment_process_forms', function (Blueprint $table) {
            $table->foreign(['department_id'], 'department_specific_recruitment_process_forms_department_id_for')->references(['id'])->on('departments')->onUpdate('no action')->onDelete('no action');
        });
    }
};
