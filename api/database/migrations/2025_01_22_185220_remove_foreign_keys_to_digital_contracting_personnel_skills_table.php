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
        Schema::table('digital_contracting_personnel_skills', function (Blueprint $table) {
            $table->dropForeign('digital_contracting_personnel_skills_digital_contracting_person');
            $table->dropForeign('digital_contracting_personnel_skills_skill_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('digital_contracting_personnel_skills', function (Blueprint $table) {
            $table->foreign(['digital_contracting_personnel_requirement_id'], 'digital_contracting_personnel_skills_digital_contracting_person')->references(['id'])->on('digital_contracting_personnel_requirements')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['skill_id'])->references(['id'])->on('skills')->onUpdate('cascade')->onDelete('cascade');
        });
    }
};
