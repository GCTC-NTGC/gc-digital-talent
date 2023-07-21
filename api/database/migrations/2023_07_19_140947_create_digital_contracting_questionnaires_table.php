<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Query\Expression;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // main table for digital contracting questionnaires
        Schema::create('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->boolean('read_preamble')->nullable();
            $table->uuid('department_id')->nullable();
            $table->foreign('department_id')->references("id")->on("departments");
            $table->string('department_other')->nullable();
            $table->string('branch_other')->nullable();
            $table->string('business_owner_name')->nullable();
            $table->string('business_owner_job_title')->nullable();
            $table->string('business_owner_email')->nullable();
            $table->string('financial_authority_name')->nullable();
            $table->string('financial_authority_job_title')->nullable();
            $table->string('financial_authority_email')->nullable();
            $table->jsonb('authorities_involved')->default(new Expression('\'[]\'::jsonb'));
            $table->string('authority_involved_other')->nullable();
            $table->string('contract_behalf_of_gc')->nullable();
            $table->string('contract_service_of_gc')->nullable();
            $table->string('contract_for_digital_initiative')->nullable();
            $table->string('digital_initiative_name')->nullable();
            $table->string('digital_initiative_plan_submitted')->nullable();
            $table->string('digital_initiative_plan_updated')->nullable();
            $table->string('digital_initiative_plan_complemented')->nullable();
            $table->string('contract_title')->nullable();
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->string('contract_extendable')->nullable();
            $table->string('contract_amendable')->nullable();
            $table->string('contract_multiyear')->nullable();
            $table->string('contract_value')->nullable();
            $table->string('contract_resources_start_timeframe')->nullable();
            $table->string('commodity_type')->nullable();
            $table->string('commodity_type_other')->nullable();
            $table->string('instrument_type')->nullable();
            $table->string('method_of_supply')->nullable();
            $table->string('method_of_supply_other')->nullable();
            $table->string('solicitation_procedure')->nullable();
            $table->string('subject_to_trade_agreement')->nullable();
            $table->text('work_requirement_description')->nullable();
            $table->text('qualification_requirement')->nullable();
            $table->string('requirement_access_to_secure')->nullable();
            $table->jsonb('requirement_screening_levels')->default(new Expression('\'[]\'::jsonb'));
            $table->string('requirement_screening_level_other')->nullable();
            $table->jsonb('requirement_work_languages')->default(new Expression('\'[]\'::jsonb'));
            $table->string('requirement_work_language_other')->nullable();
            $table->jsonb('requirement_work_locations')->default(new Expression('\'[]\'::jsonb'));
            $table->string('requirement_work_location_specific')->nullable();
            $table->string('requirement_others')->default(new Expression('\'[]\'::jsonb'));
            $table->string('requirement_other_other')->nullable();
            $table->string('has_personnel_requirements')->nullable();
            $table->jsonb('personnel_requirements')->default(new Expression('\'[]\'::jsonb'));
            $table->string('is_technological_change')->nullable();
            $table->string('has_impact_on_your_department')->nullable();
            $table->string('has_immediate_impact_on_other_departments')->nullable();
            $table->string('has_future_impact_on_other_departments')->nullable();
            $table->jsonb('operations_considerations')->default(new Expression('\'[]\'::jsonb'));
            $table->string('operations_considerations_other')->nullable();
            $table->string('contracting_rationale_primary')->nullable();
            $table->string('contracting_rationale_primary_other')->nullable();
            $table->jsonb('contracting_rationales_secondary')->default(new Expression('\'[]\'::jsonb'));
            $table->string('contracting_rationales_secondary_other')->nullable();
            $table->string('ocio_confirmed_talent_shortage')->nullable();
            $table->string('talent_search_tracking_number')->nullable();
            $table->string('ongoing_need_for_knowledge')->nullable();
            $table->string('knowledge_transfer_in_contract')->nullable();
            $table->string('employees_have_access_to_knowledge')->nullable();
            $table->string('ocio_engaged_for_training')->nullable();
        });

        // questionnaires one-to-many personnel requirements
        Schema::create('digital_contracting_personnel_requirements', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('digital_contracting_questionnaire_id');
            $table->foreign('digital_contracting_questionnaire_id')
                ->references('id')->on('digital_contracting_questionnaires')
                ->onUpdate('cascade')
                ->onDelete('cascade'); // requirement doesn't exist apart from questionnaire
            $table->string('resource_type')->nullable();
            $table->string('language')->nullable();
            $table->string('language_other')->nullable();
            $table->string('security')->nullable();
            $table->string('security_other')->nullable();
            $table->string('telework')->nullable();
            $table->integer('quantity')->nullable();
        });

        // personnel requirements many-to-many skills
        Schema::create('digital_contracting_personnel_skills', function (Blueprint $table) {
            $table->uuid('id')->primary('id')->default(new Expression('gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('digital_contracting_personnel_requirement_id');
            $table->foreign('digital_contracting_personnel_requirement_id')
                ->references('id')->on('digital_contracting_personnel_requirements')
                ->onUpdate('cascade')
                ->onDelete('cascade'); // skill requirement doesn't exist apart from parent requirement
            $table->uuid('skill_id')->nullable();
            $table->foreign('skill_id')
                ->references('id')->on('skills')
                ->onUpdate('cascade')
                ->onDelete('cascade'); // skill requirement doesn't exist apart from parent skill
            $table->unique(['digital_contracting_personnel_requirement_id', 'skill_id'], 'uq_personnel_requirement_skills'); // A requirement can only specify a skill once
            $table->string('level')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('digital_contracting_personnel_skills');
        Schema::dropIfExists('digital_contracting_personnel_requirements');
        Schema::dropIfExists('digital_contracting_questionnaires');
    }
};
