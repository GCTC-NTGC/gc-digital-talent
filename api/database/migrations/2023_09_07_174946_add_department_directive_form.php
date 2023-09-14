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
        // main table for department specific recruitment
        Schema::create('department_specific_recruitment_process_forms', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('department_id')->nullable();
            $table->foreign('department_id')->references('id')->on('departments');
            $table->string('department_other')->nullable();
            $table->string('recruitment_process_lead_name')->nullable();
            $table->string('recruitment_process_lead_job_title')->nullable();
            $table->string('recruitment_process_lead_email')->nullable();
            $table->date('posting_date')->nullable();
            $table->string('advertisement_type')->nullable();
            $table->jsonb('advertising_platforms')->default(new Expression('\'[]\'::jsonb'));
            $table->string('advertising_platforms_other')->nullable();
            $table->string('job_advertisement_link')->nullable();
        });

        // form's one-to-many positions
        Schema::create('department_specific_recruitment_process_positions', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('department_specific_recruitment_process_form_id');
            $table->foreign('department_specific_recruitment_process_form_id')
                ->references('id')->on('department_specific_recruitment_process_forms')
                ->onUpdate('cascade')
                ->onDelete('cascade'); // position doesn't exist apart from parent form
            $table->string('classification_group')->nullable();
            $table->string('classification_level')->nullable();
            $table->string('job_title')->nullable();
            $table->jsonb('employment_types')->default(new Expression('\'[]\'::jsonb'));
            $table->string('employment_types_other')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_specific_recruitment_process_positions');
        Schema::dropIfExists('department_specific_recruitment_process_forms');
    }
};
