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
        Schema::dropIfExists('digital_contracting_personnel_requirements');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('digital_contracting_personnel_requirements', function (Blueprint $table) {
            $table->uuid('id')->default('gen_random_uuid()')->primary();
            $table->timestamps();
            $table->uuid('digital_contracting_questionnaire_id');
            $table->string('resource_type')->nullable();
            $table->string('language')->nullable();
            $table->string('language_other')->nullable();
            $table->string('security')->nullable();
            $table->string('security_other')->nullable();
            $table->string('telework')->nullable();
            $table->integer('quantity')->nullable();
        });
    }
};
