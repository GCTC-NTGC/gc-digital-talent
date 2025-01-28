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
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->dropForeign('digital_contracting_questionnaires_department_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->foreign(['department_id'])->references(['id'])->on('departments')->onUpdate('no action')->onDelete('no action');
        });
    }
};
