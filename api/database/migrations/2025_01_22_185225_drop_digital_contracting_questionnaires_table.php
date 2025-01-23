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
        Schema::dropIfExists('digital_contracting_questionnaires');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('digital_contracting_questionnaires', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(new Expression('public.gen_random_uuid()'));
            $table->timestamps();
            $table->uuid('department_id')->nullable();
            $table->string('department_other')->nullable();
            $table->string('branch_other')->nullable();
            $table->string('business_owner_name')->nullable();
            $table->string('business_owner_job_title')->nullable();
            $table->string('business_owner_email')->nullable();
            $table->string('financial_authority_name')->nullable();
            $table->string('financial_authority_job_title')->nullable();
            $table->string('financial_authority_email')->nullable();
            $table->jsonb('authorities_involved')->nullable()->default('[]');
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
            $table->jsonb('requirement_screening_levels')->nullable()->default('[]');
            $table->string('requirement_screening_level_other')->nullable();
            $table->jsonb('requirement_work_languages')->nullable()->default('[]');
            $table->string('requirement_work_language_other')->nullable();
            $table->jsonb('requirement_work_locations')->nullable()->default('[]');
            $table->jsonb('requirement_others')->nullable()->default('[]');
            $table->string('requirement_other_other')->nullable();
            $table->string('has_personnel_requirements')->nullable();
            $table->string('is_technological_change')->nullable();
            $table->string('has_impact_on_your_department')->nullable();
            $table->string('has_immediate_impact_on_other_departments')->nullable();
            $table->string('has_future_impact_on_other_departments')->nullable();
            $table->jsonb('operations_considerations')->nullable()->default('[]');
            $table->string('operations_considerations_other')->nullable();
            $table->string('contracting_rationale_primary')->nullable();
            $table->string('contracting_rationale_primary_other')->nullable();
            $table->jsonb('contracting_rationales_secondary')->nullable()->default('[]');
            $table->string('contracting_rationales_secondary_other')->nullable();
            $table->string('ocio_confirmed_talent_shortage')->nullable();
            $table->string('talent_search_tracking_number')->nullable();
            $table->string('ongoing_need_for_knowledge')->nullable();
            $table->string('knowledge_transfer_in_contract')->nullable();
            $table->string('employees_have_access_to_knowledge')->nullable();
            $table->string('ocio_engaged_for_training')->nullable();
            $table->string('requirement_work_location_gc_specific')->nullable();
            $table->string('requirement_work_location_offsite_specific')->nullable();
            $table->string('contract_ftes')->nullable();
            $table->string('instrument_type_other')->nullable();
        });
    }
};
