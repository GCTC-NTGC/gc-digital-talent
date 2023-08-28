<?php

namespace App\GraphQL\Validators;

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
                Rule::prohibitedIf(!empty($this->arg('department')))
            ],
            'businessOwnerEmail' => ['email'],
            'financialAuthorityEmail' => ['email'],
            'authoritiesInvolved' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::CONTRACT_AUTHORITY_OTHER, 'authorityInvolvedOther')
            ],
            'contractEndDate' => ['after_or_equal:contractStartDate'],
            'commodityType' => [
                new ScalarConsistentWithDetail(DirectiveFormsApiEnums::CONTRACT_COMMODITY_OTHER, 'commodityTypeOther')
            ],
            'methodOfSupply' => [
                new ScalarConsistentWithDetail(DirectiveFormsApiEnums::CONTRACT_SUPPLY_METHOD_OTHER, 'methodOfSupplyOther')
            ],
            'requirementScreeningLevels' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_SCREENING_LEVEL_OTHER, 'requirementScreeningLevelOther')
            ],
            'requirementWorkLanguages' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_LANGUAGE_OTHER, 'requirementWorkLanguageOther')
            ],
            'requirementWorkLocations' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_WORK_LOCATION_OFFSITE_SPECIFIC, 'requirementWorkLocationSpecific')
            ],
            'requirementOthers' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::PERSONNEL_OTHER_REQUIREMENT_OTHER, 'requirementOtherOther')
            ],
            'personnelRequirements' => [
                'requiredIf:hasPersonnelRequirements,' . DirectiveFormsApiEnums::YESNOUNSURE_YES,
                'prohibited_unless:hasPersonnelRequirements,' . DirectiveFormsApiEnums::YESNOUNSURE_YES,
            ],
            'operationsConsiderations' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::OPERATIONS_CONSIDERATION_OTHER, 'operationsConsiderationsOther')
            ],
            'contractingRationalePrimary' => [
                Rule::notIn($this->arg('contractingRationalesSecondary')),
                new ScalarConsistentWithDetail(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, 'contractingRationalePrimaryOther')
            ],
            'contractingRationalesSecondary' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::CONTRACTING_RATIONALE_OTHER, 'contractingRationalesSecondaryOther')
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
