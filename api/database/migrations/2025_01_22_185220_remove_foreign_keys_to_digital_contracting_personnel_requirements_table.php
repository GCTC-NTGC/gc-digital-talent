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
        Schema::table('digital_contracting_personnel_requirements', function (Blueprint $table) {
            $table->dropForeign('digital_contracting_personnel_requirements_digital_contracting_');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('digital_contracting_personnel_requirements', function (Blueprint $table) {
            $table->foreign(['digital_contracting_questionnaire_id'], 'digital_contracting_personnel_requirements_digital_contracting_')->references(['id'])->on('digital_contracting_questionnaires')->onUpdate('cascade')->onDelete('cascade');
        });
    }
};
