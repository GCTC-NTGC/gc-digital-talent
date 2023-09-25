<?php

namespace Database\Factories;

use App\Enums\DirectiveForms\ContractAuthority;
use App\Enums\DirectiveForms\ContractCommodity;
use App\Enums\DirectiveForms\ContractFteRange;
use App\Enums\DirectiveForms\ContractingRationale;
use App\Enums\DirectiveForms\ContractInstrument;
use App\Enums\DirectiveForms\ContractSolicitationProcedure;
use App\Enums\DirectiveForms\ContractStartTimeframe;
use App\Enums\DirectiveForms\ContractSupplyMethod;
use App\Enums\DirectiveForms\ContractValueRange;
use App\Enums\DirectiveForms\OperationsConsideration;
use App\Enums\DirectiveForms\PersonnelLanguage;
use App\Enums\DirectiveForms\PersonnelOtherRequirement;
use App\Enums\DirectiveForms\PersonnelScreeningLevel;
use App\Enums\DirectiveForms\PersonnelWorkLocation;
use App\Enums\DirectiveForms\YesNo;
use App\Enums\DirectiveForms\YesNoUnsure;
use App\Models\Department;
use App\Models\DigitalContractingPersonnelRequirement;
use App\Models\DigitalContractingQuestionnaire;
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
                array_column(ContractAuthority::cases(), 'name'),
                $this->faker->numberBetween(1, count(ContractAuthority::cases()))
            ),
            'authority_involved_other' => function (array $attributes) {
                return in_array(ContractAuthority::OTHER->name, $attributes['authorities_involved']) ? $this->faker->word() : null;
            },
            'contract_behalf_of_gc' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'contract_service_of_gc' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'contract_for_digital_initiative' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'digital_initiative_name' => $this->faker->word(),
            'digital_initiative_plan_submitted' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'digital_initiative_plan_updated' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'digital_initiative_plan_complemented' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'contract_title' => $this->faker->word(),
            'contract_start_date' => Carbon::today()->addDays($this->faker->numberBetween(31, 365))->startOfMonth(),
            'contract_end_date' => function (array $attributes) {
                return $attributes['contract_start_date']->copy()->addDays($this->faker->numberBetween(31, 365))->startOfMonth();
            },
            'contract_extendable' => $this->faker->randomElement(YesNo::cases())->name,
            'contract_amendable' => $this->faker->randomElement(YesNo::cases())->name,
            'contract_multiyear' => $this->faker->randomElement(YesNo::cases())->name,
            'contract_value' => $this->faker->randomElement(ContractValueRange::cases())->name,
            'contract_ftes' => $this->faker->randomElement(ContractFteRange::cases())->name,
            'contract_resources_start_timeframe' => $this->faker->randomElement(ContractStartTimeframe::cases())->name,
            'commodity_type' => $this->faker->randomElement(ContractCommodity::cases())->name,
            'commodity_type_other' => function (array $attributes) {
                return $attributes['commodity_type'] == ContractCommodity::OTHER->name ? $this->faker->word() : null;
            },
            'instrument_type' => $this->faker->randomElement(ContractInstrument::cases())->name,
            'instrument_type_other' => function (array $attributes) {
                return $attributes['instrument_type'] == ContractInstrument::OTHER->name ? $this->faker->word() : null;
            },
            'method_of_supply' => $this->faker->randomElement(ContractSupplyMethod::cases())->name,
            'method_of_supply_other' => function (array $attributes) {
                return $attributes['method_of_supply'] == ContractSupplyMethod::OTHER->name ? $this->faker->word() : null;
            },
            'solicitation_procedure' => $this->faker->randomElement(ContractSolicitationProcedure::cases())->name,
            'subject_to_trade_agreement' => $this->faker->randomElement(YesNoUnsure::cases())->name,
            'work_requirement_description' => $this->faker->paragraph(),
            'has_personnel_requirements' => $this->faker->randomElement(YesNo::cases())->name,
            // personnel_requirements added in configure method
            'qualification_requirement' => function (array $attributes) {
                return $attributes['has_personnel_requirements'] === YesNo::NO->name ? $this->faker->paragraph() : null;
            },
            'requirement_access_to_secure' => function (array $attributes) {
                return $attributes['has_personnel_requirements'] === YesNo::NO->name
                    ? $this->faker->randomElement(array_column(YesNoUnsure::cases(), 'name'))
                    : null;
            },
            'requirement_screening_levels' => function (array $attributes) {
                return $attributes['has_personnel_requirements'] === YesNo::NO->name
                    ? $this->faker->randomElements(
                        array_column(PersonnelScreeningLevel::cases(), 'name'),
                        $this->faker->numberBetween(1, count(PersonnelScreeningLevel::cases()))
                    )
                    : [];
            },
            'requirement_screening_level_other' => function (array $attributes) {
                return in_array(PersonnelScreeningLevel::OTHER->name, $attributes['requirement_screening_levels']) ? $this->faker->word() : null;
            },
            'requirement_work_languages' => function (array $attributes) {
                return $attributes['has_personnel_requirements'] === YesNo::NO->name
                    ? $this->faker->randomElements(
                        array_column(PersonnelLanguage::cases(), 'name'),
                        $this->faker->numberBetween(1, count(PersonnelLanguage::cases())))
                : [];
            },
            'requirement_work_language_other' => function (array $attributes) {
                return in_array(PersonnelLanguage::OTHER->name, $attributes['requirement_work_languages']) ? $this->faker->word() : null;
            },
            'requirement_work_locations' => function (array $attributes) {
                return $attributes['has_personnel_requirements'] === YesNo::NO->name
                    ? $this->faker->randomElements(
                        array_column(PersonnelWorkLocation::cases(), 'name'),
                        $this->faker->numberBetween(1, count(PersonnelWorkLocation::cases())))
                : [];
            },
            'requirement_work_location_gc_specific' => function (array $attributes) {
                return in_array(PersonnelWorkLocation::GC_PREMISES->name, $attributes['requirement_work_locations']) ? $this->faker->word() : null;
            },
            'requirement_work_location_offsite_specific' => function (array $attributes) {
                return in_array(PersonnelWorkLocation::OFFSITE_SPECIFIC->name, $attributes['requirement_work_locations']) ? $this->faker->word() : null;
            },
            'requirement_others' => $this->faker->randomElements(
                array_column(PersonnelOtherRequirement::cases(), 'name'),
                $this->faker->numberBetween(1, count(PersonnelOtherRequirement::cases()))
            ),
            'requirement_other_other' => function (array $attributes) {
                return in_array(PersonnelOtherRequirement::OTHER->name, $attributes['requirement_others']) ? $this->faker->word() : null;
            },
            'is_technological_change' => $this->faker->randomElement(YesNo::cases())->name,
            'has_impact_on_your_department' => $this->faker->randomElement(YesNo::cases())->name,
            'has_immediate_impact_on_other_departments' => $this->faker->randomElement(YesNo::cases())->name,
            'has_future_impact_on_other_departments' => $this->faker->randomElement(YesNo::cases())->name,
            'operations_considerations' => $this->faker->randomElements(
                array_column(OperationsConsideration::cases(), 'name'),
                $this->faker->numberBetween(1, count(OperationsConsideration::cases()))
            ),
            'operations_considerations_other' => function (array $attributes) {
                return in_array(OperationsConsideration::OTHER->name, $attributes['operations_considerations']) ? $this->faker->word() : null;
            },
            'contracting_rationale_primary' => $this->faker->randomElement(
                ContractingRationale::cases()
            )->name,
            'contracting_rationale_primary_other' => function (array $attributes) {
                return $attributes['contracting_rationale_primary'] == ContractingRationale::OTHER->name ? $this->faker->word() : null;
            },
            'contracting_rationales_secondary' => $this->faker->randomElements(
                array_column(ContractingRationale::cases(), 'name'),
                $this->faker->numberBetween(1, count(ContractingRationale::cases()))
            ),
            'contracting_rationales_secondary_other' => function (array $attributes) {
                return in_array(ContractingRationale::OTHER->name, $attributes['contracting_rationales_secondary']) ? $this->faker->word() : null;
            },
            'ocio_confirmed_talent_shortage' => $this->faker->randomElement(
                YesNo::cases()
            )->name,
            'talent_search_tracking_number' => function (array $attributes) {
                return $attributes['ocio_confirmed_talent_shortage'] == YesNo::YES->name ? $this->faker->uuid() : null;
            },
            'ongoing_need_for_knowledge' => $this->faker->randomElement(YesNo::cases())->name,
            'knowledge_transfer_in_contract' => $this->faker->randomElement(YesNo::cases())->name,
            'employees_have_access_to_knowledge' => $this->faker->randomElement(YesNo::cases())->name,
            'ocio_engaged_for_training' => $this->faker->randomElement(YesNo::cases())->name,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (DigitalContractingQuestionnaire $questionnaire) {
            if ($questionnaire->has_personnel_requirements == YesNo::YES->name) {
                DigitalContractingPersonnelRequirement::factory()
                    ->count($this->faker->numberBetween(1, 10))
                    ->for($questionnaire)
                    ->create();
            }
        });
    }
}
