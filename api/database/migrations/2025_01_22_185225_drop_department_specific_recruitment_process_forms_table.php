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
        Schema::dropIfExists('department_specific_recruitment_process_forms');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('department_specific_recruitment_process_forms', function (Blueprint $table) {
            $table->uuid('id')->default('gen_random_uuid()')->primary();
            $table->timestamps();
            $table->uuid('department_id')->nullable();
            $table->string('department_other')->nullable();
            $table->string('recruitment_process_lead_name')->nullable();
            $table->string('recruitment_process_lead_job_title')->nullable();
            $table->string('recruitment_process_lead_email')->nullable();
            $table->date('posting_date')->nullable();
            $table->string('advertisement_type')->nullable();
            $table->jsonb('advertising_platforms')->default('[]');
            $table->string('advertising_platforms_other')->nullable();
            $table->string('job_advertisement_link')->nullable();
        });
    }
};
