<?php

namespace App\GraphQL\Validators;

use App\Rules\ArrayConsistentWithDetail;
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
                Rule::prohibitedIf(!empty($this->arg('department')))
            ],
            'businessOwnerEmail' => ['email'],
            'financialAuthorityEmail' => ['email'],
            'authoritiesInvolved' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::CONTRACT_AUTHORITY_OTHER, 'authorityInvolvedOther')
            ],
            'authorityInvolvedOther' => [
                Rule::prohibitedIf(!is_array($this->arg('authoritiesInvolved')))
            ],
            'contractEndDate' => ['after_or_equal:contractStartDate'],
            'commodityTypeOther' => [
                'requiredIf:commodityType,' . DirectiveFormsApiEnums::CONTRACT_COMMODITY_OTHER,
                'prohibited_unless:commodityType,' . DirectiveFormsApiEnums::CONTRACT_COMMODITY_OTHER,
            ],
            'methodOfSupplyOther' => [
                'requiredIf:methodOfSupply,' . DirectiveFormsApiEnums::CONTRACT_SUPPLY_METHOD_OTHER,
                'prohibited_unless:methodOfSupply,' . DirectiveFormsApiEnums::CONTRACT_SUPPLY_METHOD_OTHER,
            ],
            'requirementScreeningLevels' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, 'requirementScreeningLevelOther')
            ],
            'requirementScreeningLevelOther' => [
                Rule::prohibitedIf(!is_array($this->arg('requirementScreeningLevels')))
            ],
            'requirementWorkLanguages' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, 'requirementWorkLanguageOther')
            ],
            'requirementWorkLanguageOther' => [
                Rule::prohibitedIf(!is_array($this->arg('requirementWorkLanguages')))
            ],
            'requirementWorkLocations' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, 'requirementWorkLocationSpecific')
            ],
            'requirementWorkLocationSpecific' => [
                Rule::prohibitedIf(!is_array($this->arg('requirementWorkLocations')))
            ],
            'requirementOthers' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, 'requirementOtherOther')
            ],
            'requirementOtherOther' => [
                Rule::prohibitedIf(!is_array($this->arg('requirementOthers')))
            ],
            'personnelRequirements' => [
                'requiredIf:hasPersonnelRequirements,' . DirectiveFormsApiEnums::YESNOUNSURE_YES,
                'prohibited_unless:hasPersonnelRequirements,' . DirectiveFormsApiEnums::YESNOUNSURE_YES,
            ],
            'operationsConsiderations' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, 'operationsConsiderationsOther')
            ],
            'operationsConsiderationsOther' => [
                Rule::prohibitedIf(!is_array($this->arg('operationsConsiderations')))
            ],
            'contractingRationalePrimary' => [
                Rule::notIn($this->arg('contractingRationalesSecondary')),
            ],
            'contractingRationalePrimaryOther' => [
                'requiredIf:contractingRationalePrimary,' . DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER,
                'prohibited_unless:contractingRationalePrimary,' . DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER,
            ],
            'contractingRationalesSecondary' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, 'contractingRationalesSecondaryOther')
            ],
            'contractingRationalesSecondaryOther' => [
                Rule::prohibitedIf(!is_array($this->arg('contractingRationalesSecondary')))
            ],
            'talentSearchTrackingNumber' => ['requiredIf:ocioConfirmedTalentShortage,' . DirectiveFormsApiEnums::YESNOUNSURE_YES],
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
