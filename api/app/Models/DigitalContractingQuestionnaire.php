<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class DigitalContractingQuestionnaire
 *
 * @property string $id
 * @property string $department_other
 * @property string $branch_other
 * @property string $business_owner_name
 * @property string $business_owner_job_title
 * @property string $business_owner_email
 * @property string $financial_authority_name
 * @property string $financial_authority_job_title
 * @property string $financial_authority_email
 * @property array $authorities_involved
 * @property string $authority_involved_other
 * @property string $contract_behalf_of_gc
 * @property string $contract_service_of_gc
 * @property string $contract_for_digital_initiative
 * @property string $digital_initiative_name
 * @property string $digital_initiative_plan_submitted
 * @property string $digital_initiative_plan_updated
 * @property string $digital_initiative_plan_complemented
 * @property string $contract_title
 * @property string $contract_start_date
 * @property string $contract_end_date
 * @property string $contract_extendable
 * @property string $contract_amendable
 * @property string $contract_multiyear
 * @property string $contract_value
 * @property string $contract_ftes
 * @property string $contract_resources_start_timeframe
 * @property string $commodity_type
 * @property string $commodity_type_other
 * @property string $instrument_type
 * @property string $instrument_type_other
 * @property string $method_of_supply
 * @property string $method_of_supply_other
 * @property string $solicitation_procedure
 * @property string $subject_to_trade_agreement
 * @property string $work_requirement_description
 * @property string $has_personnel_requirements
 * @property array $personnel_requirements
 * @property string $qualification_requirement
 * @property string $requirement_access_to_secure
 * @property array $requirement_screening_levels
 * @property string $requirement_screening_level_other
 * @property array $requirement_work_languages
 * @property string $requirement_work_language_other
 * @property array $requirement_work_locations
 * @property string $requirement_work_location_gc_specific
 * @property string $requirement_work_location_offsite_specific
 * @property array $requirement_others
 * @property string $requirement_other_other
 * @property string $is_technological_change
 * @property string $has_impact_on_your_department
 * @property string $has_immediate_impact_on_other_departments
 * @property string $has_future_impact_on_other_departments
 * @property array $operations_considerations
 * @property string $operations_considerations_other
 * @property string $contracting_rationale_primary
 * @property string $contracting_rationale_primary_other
 * @property array $contracting_rationales_secondary
 * @property string $contracting_rationales_secondary_other
 * @property string $ocio_confirmed_talent_shortage
 * @property string $talent_search_tracking_number
 * @property string $ongoing_need_for_knowledge
 * @property string $knowledge_transfer_in_contract
 * @property string $employees_have_access_to_knowledge
 * @property string $ocio_engaged_for_training
 */
class DigitalContractingQuestionnaire extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'authorities_involved' => 'array',
        'requirement_screening_levels' => 'array',
        'requirement_work_languages' => 'array',
        'requirement_work_locations' => 'array',
        'requirement_others' => 'array',
        'personnel_requirements' => 'array',
        'operations_considerations' => 'array',
        'contracting_rationales_secondary' => 'array',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function personnelRequirements(): HasMany
    {
        return $this->hasMany(DigitalContractingPersonnelRequirement::class);
    }
}
