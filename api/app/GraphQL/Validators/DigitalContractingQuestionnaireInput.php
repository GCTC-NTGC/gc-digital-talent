<?php

namespace App\GraphQL\Validators;

use App\Enums\DirectiveForms\ContractAuthority;
use App\Enums\DirectiveForms\ContractCommodity;
use App\Enums\DirectiveForms\ContractSupplyMethod;
use App\Enums\DirectiveForms\YesNoUnsure;
use App\Rules\ArrayConsistentWithDetail;
use App\Rules\ScalarConsistentWithDetail;
use Database\Helpers\DirectiveFormsApiEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class DigitalContractingQuestionnaireInput extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'readPreamble' => ['accepted'],
            'departmentOther' => [
                'required_without:department',
                Rule::prohibitedIf(! empty($this->arg('department'))),
            ],
            'businessOwnerEmail' => ['email'],
            'financialAuthorityEmail' => ['email'],
            'authoritiesInvolved' => [
                new ArrayConsistentWithDetail(ContractAuthority::OTHER->name, 'authorityInvolvedOther'),
            ],
            'contractEndDate' => ['after_or_equal:contractStartDate'],
            'commodityType' => [
                new ScalarConsistentWithDetail(ContractCommodity::OTHER->name, 'commodityTypeOther'),
            ],
            'methodOfSupply' => [
                new ScalarConsistentWithDetail(ContractSupplyMethod::OTHER->name, 'methodOfSupplyOther'),
            ],
            'requirementScreeningLevels' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, 'requirementScreeningLevelOther'),
            ],
            'requirementWorkLanguages' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, 'requirementWorkLanguageOther'),
            ],
            'requirementWorkLocations' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, 'requirementWorkLocationSpecific'),
            ],
            'requirementOthers' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, 'requirementOtherOther'),
            ],
            'personnelRequirements' => [
                'requiredIf:hasPersonnelRequirements,'.YesNoUnsure::YES->name,
                'prohibited_unless:hasPersonnelRequirements,'.YesNoUnsure::YES->name,
            ],
            'operationsConsiderations' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, 'operationsConsiderationsOther'),
            ],
            'contractingRationalePrimary' => [
                Rule::notIn($this->arg('contractingRationalesSecondary')),
                new ScalarConsistentWithDetail(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, 'contractingRationalePrimaryOther'),
            ],
            'contractingRationalesSecondary' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, 'contractingRationalesSecondaryOther'),
            ],
            'talentSearchTrackingNumber' => ['requiredIf:ocioConfirmedTalentShortage,'.YesNoUnsure::YES->name],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
