<?php

namespace App\GraphQL\Validators;

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
            'authorityInvolvedOther' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::CONTRACT_AUTHORITY_OTHER, $this->arg('authoritiesInvolved'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::CONTRACT_AUTHORITY_OTHER, $this->arg('authoritiesInvolved')))
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
            'requirementScreeningLevelOther' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, $this->arg('requirementScreeningLevels'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, $this->arg('requirementScreeningLevels')))
            ],
            'requirementWorkLanguageOther' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, $this->arg('requirementWorkLanguages'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, $this->arg('requirementWorkLanguages')))
            ],
            'requirementWorkLocationSpecific' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, $this->arg('requirementWorkLocations'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, $this->arg('requirementWorkLocations')))
            ],
            'requirementOtherOther' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, $this->arg('requirementOthers'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, $this->arg('requirementOthers')))
            ],
            'personnelRequirements' => [
                'requiredIf:hasPersonnelRequirements,' . DirectiveFormsApiEnums::YESNOUNSURE_YES,
                'prohibited_unless:hasPersonnelRequirements,' . DirectiveFormsApiEnums::YESNOUNSURE_YES,
            ],
            'operationsConsiderationsOther' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, $this->arg('operationsConsiderations'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, $this->arg('operationsConsiderations')))
            ],
            'contractingRationalePrimary' => [
                Rule::notIn($this->arg('contractingRationalesSecondary')),
            ],
            'contractingRationalePrimaryOther' => [
                'requiredIf:contractingRationalePrimary,' . DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER,
                'prohibited_unless:contractingRationalePrimary,' . DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER,
            ],
            'contractingRationalesSecondaryOther' => [
                Rule::requiredIf(in_array(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, $this->arg('contractingRationalesSecondary'))),
                Rule::prohibitedIf(!in_array(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, $this->arg('contractingRationalesSecondary')))
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
