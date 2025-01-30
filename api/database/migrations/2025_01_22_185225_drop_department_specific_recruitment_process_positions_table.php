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
        Schema::dropIfExists('department_specific_recruitment_process_positions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('department_specific_recruitment_process_positions', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('department_specific_recruitment_process_form_id');
            $table->string('classification_group')->nullable();
            $table->string('classification_level')->nullable();
            $table->string('job_title')->nullable();
            $table->jsonb('employment_types')->default('[]');
            $table->string('employment_types_other')->nullable();
        });
    }
};
