<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\DigitalContractingQuestionnaire;
use App\Models\DigitalContractingPersonnelRequirement;
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
        return [
            'read_preamble' => $this->faker->boolean(),
            'department_id' => $this->faker->boolean(75)
                ? Department::inRandomOrder()
                ->limit(1)
                ->pluck('id')
                ->first()
                : null,
            'department_other' => function (array $attributes) {
                return $attributes['department_id'] ? null : $this->faker->company();
            },
            'branch_other' => $this->faker->company(),
            'business_owner_name' => $this->faker->name(),
            'business_owner_job_title' => $this->faker->jobTitle(),
            'business_owner_email' => $this->faker->email(),
            'financial_authority_name' => $this->faker->name(),
            'financial_authority_job_title' => $this->faker->jobTitle(),
            'financial_authority_email' => $this->faker->email(),
            'authorities_involved' => $this->faker->randomElements(
                DirectiveFormsApiEnums::contractAuthorities(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::contractAuthorities()))
            ),
            'authority_involved_other' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::CONTRACT_AUTHORITY_OTHER, $attributes['authorities_involved']) ? $this->faker->word() : null;
            },
            'contract_behalf_of_gc' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'contract_service_of_gc' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'contract_for_digital_initiative' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'digital_initiative_name' => $this->faker->word(),
            'digital_initiative_plan_submitted' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'digital_initiative_plan_updated' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'digital_initiative_plan_complemented' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'contract_title' => $this->faker->word(),
            'contract_start_date' => Carbon::today()->addDays($this->faker->numberBetween(31, 365))->startOfMonth(),
            'contract_end_date' => function (array $attributes) {
                return $attributes['contract_start_date']->copy()->addDays($this->faker->numberBetween(31, 365))->startOfMonth();
            },
            'contract_extendable' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'contract_amendable' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'contract_multiyear' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'contract_value' => $this->faker->randomElement(DirectiveFormsApiEnums::contractValueRanges()),
            'contract_resources_start_timeframe' => $this->faker->randomElement(DirectiveFormsApiEnums::contractStartTimeframes()),
            'commodity_type' => $this->faker->randomElement(DirectiveFormsApiEnums::contractCommodities()),
            'commodity_type_other' => function (array $attributes) {
                return $attributes['commodity_type'] == DirectiveFormsApiEnums::CONTRACT_COMMODITY_OTHER ? $this->faker->word() : null;
            },
            'instrument_type' => $this->faker->randomElement(DirectiveFormsApiEnums::contractInstruments()),
            'method_of_supply' => $this->faker->randomElement(DirectiveFormsApiEnums::contractSupplyMethods()),
            'method_of_supply_other' => function (array $attributes) {
                return $attributes['method_of_supply'] == DirectiveFormsApiEnums::CONTRACT_SUPPLY_METHOD_OTHER ? $this->faker->word() : null;
            },
            'solicitation_procedure' => $this->faker->randomElement(DirectiveFormsApiEnums::contractSolicitationProcedures()),
            'subject_to_trade_agreement' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'work_requirement_description' => $this->faker->paragraph(),
            'qualification_requirement' => $this->faker->paragraph(),
            'requirement_access_to_secure' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNoUnsure()),
            'requirement_screening_levels' => $this->faker->randomElements(
                DirectiveFormsApiEnums::personnelScreeningLevels(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelScreeningLevels()))
            ),
            'requirement_screening_level_other' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, $attributes['requirement_screening_levels']) ? $this->faker->word() : null;
            },
            'requirement_work_languages' => $this->faker->randomElements(
                DirectiveFormsApiEnums::personnelLanguages(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelLanguages()))
            ),
            'requirement_work_language_other' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, $attributes['requirement_work_languages']) ? $this->faker->word() : null;
            },
            'requirement_work_locations' => $this->faker->randomElements(
                DirectiveFormsApiEnums::personnelWorkLocations(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelWorkLocations()))
            ),
            'requirement_work_location_specific' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, $attributes['requirement_work_locations']) ? $this->faker->word() : null;
            },
            'requirement_others' => $this->faker->randomElements(
                DirectiveFormsApiEnums::personnelOtherRequirements(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::personnelOtherRequirements()))
            ),
            'requirement_other_other' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, $attributes['requirement_others']) ? $this->faker->word() : null;
            },
            'has_personnel_requirements' => $this->faker->boolean(),
            // personnel_requirements added in configure method
            'is_technological_change' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'has_impact_on_your_department' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'has_immediate_impact_on_other_departments' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'has_future_impact_on_other_departments' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'operations_considerations' => $this->faker->randomElements(
                DirectiveFormsApiEnums::operationsConsiderations(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::operationsConsiderations()))
            ),
            'operations_considerations_other' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, $attributes['operations_considerations']) ? $this->faker->word() : null;
            },
            'contracting_rationale_primary' => $this->faker->randomElement(
                DirectiveFormsApiEnums::contractingRationales()
            ),
            'contracting_rationale_primary_other' => function (array $attributes) {
                return $attributes['contracting_rationale_primary'] == DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER ? $this->faker->word() : null;
            },
            'contracting_rationales_secondary' => $this->faker->randomElements(
                DirectiveFormsApiEnums::contractingRationales(),
                $this->faker->numberBetween(1, count(DirectiveFormsApiEnums::contractingRationales()))
            ),
            'contracting_rationales_secondary_other' => function (array $attributes) {
                return in_array(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, $attributes['contracting_rationales_secondary']) ? $this->faker->word() : null;
            },
            'ocio_confirmed_talent_shortage' => $this->faker->randomElement(
                DirectiveFormsApiEnums::yesNo()
            ),
            'talent_search_tracking_number' => function (array $attributes) {
                return $attributes['ocio_confirmed_talent_shortage'] == DirectiveFormsApiEnums::YESNO_YES ? $this->faker->uuid() : null;
            },
            'ongoing_need_for_knowledge' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'knowledge_transfer_in_contract' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'employees_have_access_to_knowledge' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
            'ocio_engaged_for_training' => $this->faker->randomElement(DirectiveFormsApiEnums::yesNo()),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (DigitalContractingQuestionnaire $questionnaire) {
            if ($questionnaire->has_personnel_requirements) {
                DigitalContractingPersonnelRequirement::factory()
                    ->count($this->faker->numberBetween(1, 10))
                    ->for($questionnaire)
                    ->create();
            }
        });
    }
}
