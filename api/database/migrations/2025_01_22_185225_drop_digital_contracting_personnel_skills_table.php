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
        Schema::dropIfExists('digital_contracting_personnel_skills');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('digital_contracting_personnel_skills', function (Blueprint $table) {
            $table->uuid('id')->default('gen_random_uuid()')->primary();
            $table->timestamps();
            $table->uuid('digital_contracting_personnel_requirement_id');
            $table->uuid('skill_id')->nullable();
            $table->string('level')->nullable();

            $table->unique(['digital_contracting_personnel_requirement_id', 'skill_id'], 'uq_personnel_requirement_skills');
        });
    }
};
