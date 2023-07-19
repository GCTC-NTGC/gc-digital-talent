<?php

namespace Database\Factories;

use App\Models\Department;
use Database\Helpers\DirectiveFormsApiEnums;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DigitalContractingQuestionnaire>
 */
class DigitalContractingQuestionnaireFactory extends Factory
{


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hasDepartment = $this->faker->boolean(75);
        if ($hasDepartment) {
            $departmentId = Department::inRandomOrder()
                ->limit(1)
                ->pluck('id')
                ->first();
            if (is_null($departmentId))
                $departmentId = Department::factory()->create()->id;
        }
        $authoritiesInvolved = $this->faker->randomElements(
            DirectiveFormsApiEnums::contractAuthorities(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::contractAuthorities()))
        );
        $contractStartDate = Carbon::today()->addDays($this->faker->numberBetween(31, 365))->startOfMonth();
        $contractEndDate = $contractStartDate->copy()->addDays($this->faker->numberBetween(31, 365))->startOfMonth();
        $contractCommodity = $this->faker->randomElement(DirectiveFormsApiEnums::contractCommodities());
        $contractSupplyMethod = $this->faker->randomElement(DirectiveFormsApiEnums::contractSupplyMethods());
        $requirementScreeningLevels = $this->faker->randomElements(
            DirectiveFormsApiEnums::personnelScreeningLevels(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelScreeningLevels()))
        );
        $requirementLanguages = $this->faker->randomElements(
            DirectiveFormsApiEnums::personnelLanguages(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelLanguages()))
        );
        $requirementWorkLocations = $this->faker->randomElements(
            DirectiveFormsApiEnums::personnelWorkLocations(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelWorkLocations()))
        );
        $requirementOthers = $this->faker->randomElements(
            DirectiveFormsApiEnums::personnelOtherRequirements(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelOtherRequirements()))
        );
        $operationsConsiderations = $this->faker->randomElements(
            DirectiveFormsApiEnums::operationsConsiderations(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::operationsConsiderations()))
        );
        $contractingRationalePrimary = $this->faker->randomElement(
            DirectiveFormsApiEnums::contractingRationales()
        );
        $contractingRationalesSecondary = $this->faker->randomElements(
            DirectiveFormsApiEnums::contractingRationales(),
            $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::contractingRationales()))
        );
        $ocioConfirmedShortage = $this->faker->randomElement(
            DirectiveFormsApiEnums::yesNo()
        );

        return [
            'read_preamble' => $this->faker->boolean(),
            'department_id' => $hasDepartment ? $departmentId : null,
            'department_other' => $hasDepartment ? null : $this->faker->company(),
            'branch_other' => $this->faker->company(),
            'business_owner_name' => $this->faker->name(),
            'business_owner_job_title' => $this->faker->jobTitle(),
            'business_owner_email' => $this->faker->email(),
            'financial_authority_name' => $this->faker->name(),
            'financial_authority_job_title' => $this->faker->jobTitle(),
            'financial_authority_email' => $this->faker->email(),
            'authorities_involved' => $authoritiesInvolved,
            'authority_involved_other' => in_array(DirectiveFormsApiEnums::CONTRACT_AUTHORITY_OTHER, $authoritiesInvolved) ? $this->faker->word() : null,
            'contract_behalf_of_gc' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'contract_service_of_gc' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'contract_for_digital_initiative' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'digital_initiative_name' => $this->faker->word(),
            'digital_initiative_plan_submitted' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'digital_initiative_plan_updated' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'digital_initiative_plan_complemented' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'contract_title' => $this->faker->word(),
            'contract_start_date' => $contractStartDate,
            'contract_end_date' => $contractEndDate,
            'contract_extendable' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'contract_amendable' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'contract_multiyear' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'contract_value' => $this->faker->randomElement(DirectiveFormsApiEnums::contractValueRanges()),
            'contract_resources_start_timeframe' => $this->faker->randomElement(DirectiveFormsApiEnums::contractStartTimeframes()),
            'commodity_type' => $contractCommodity,
            'commodity_type_other' => $contractCommodity == DirectiveFormsApiEnums::CONTRACT_COMMODITY_OTHER ? $this->faker->word() : null,
            'instrument_type' => $this->faker->randomElement(DirectiveFormsApiEnums::contractInstruments()),
            'method_of_supply' => $contractSupplyMethod,
            'method_of_supply_other' => $contractSupplyMethod == DirectiveFormsApiEnums::CONTRACT_SUPPLY_METHOD_OTHER ? $this->faker->word() : null,
            'solicitation_procedure' => $this->faker->randomElement(DirectiveFormsApiEnums::contractSolicitationProcedures()),
            'subject_to_trade_agreement' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'work_requirement_description' => $this->faker->paragraph(),
            'qualification_requirement' => $this->faker->paragraph(),
            'requirement_access_to_secure' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'requirement_screening_levels' => $requirementScreeningLevels,
            'requirement_screening_level_other' =>  in_array(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, $requirementScreeningLevels) ? $this->faker->word() : null,
            'requirement_work_languages' => $requirementLanguages,
            'requirement_work_language_other' => in_array(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, $requirementLanguages) ? $this->faker->word() : null,
            'requirement_work_locations' => $requirementWorkLocations,
            'requirement_work_location_specific' => in_array(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, $requirementWorkLocations) ? $this->faker->word() : null,
            'requirement_others' => $requirementOthers,
            'requirement_other_other' => in_array(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, $requirementOthers) ? $this->faker->word() : null,
            //  'has_personnel_requirements
            //  * @property array personnel_requirements
            'is_technological_change' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'has_impact_on_your_department' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'has_immediate_impact_on_other_departments' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'has_future_impact_on_other_departments' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'operations_considerations' => $operationsConsiderations,
            'operations_considerations_other' => in_array(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, $operationsConsiderations) ? $this->faker->word() : null,
            'contracting_rationale_primary' => $contractingRationalePrimary,
            'contracting_rationale_primary_other' => $contractingRationalePrimary == DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER ? $this->faker->word() : null,
            'contracting_rationales_secondary' => $contractingRationalesSecondary,
            'contracting_rationales_secondary_other' =>  in_array(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, $contractingRationalesSecondary) ? $this->faker->word() : null,
            'ocio_confirmed_talent_shortage' => $ocioConfirmedShortage,
            'talent_search_tracking_number' => $ocioConfirmedShortage == DirectiveFormsApiEnums::YESNO_YES ? $this->faker->uuid() : null,
            'ongoing_need_for_knowledge' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'knowledge_transfer_in_contract' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'employees_have_access_to_knowledge' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'ocio_engaged_for_training' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
        ];
    }
}
