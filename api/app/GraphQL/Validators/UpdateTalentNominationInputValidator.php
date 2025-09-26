<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationNomineeRelationshipToNominator;
use App\Enums\TalentNominationStep;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\SkillFamily;
use App\Models\TalentNomination;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentNominationInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'insertSubmittedStep' => [
                Rule::in(array_column(TalentNominationStep::cases(), 'name')),
                // can only review and submit using the submit mutation
                Rule::notIn([TalentNominationStep::REVIEW_AND_SUBMIT->name]),
            ],
            'nominator.connect' => [
                'uuid',
                'exists:users,id',
                'prohibits:nominatorFallbackWorkEmail,nominatorFallbackName,nominatorFallbackClassification.connect,nominatorFallbackDepartment.connect',
            ],
            'submitterRelationshipToNominator' => [
                'nullable',
                Rule::in(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name')),
            ],
            'submitterRelationshipToNominatorOther' => [
                'required_if:submitterRelationshipToNominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'prohibited_unless:submitterRelationshipToNominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'nullable',
                'string',
            ],
            'nominatorFallbackWorkEmail' => ['nullable', new GovernmentEmailRegex],
            'nominatorFallbackName' => ['nullable', 'string'],
            'nominatorFallbackClassification.connect' => [
                'uuid',
                'exists:classifications,id',
            ],
            'nominatorFallbackDepartment.connect' => [
                'uuid',
                'exists:departments,id',
            ],
            'nominatorReview' => [
                'nullable',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'nominee' => ['required_array_keys:connect'],
            'nominee.connect' => [
                'uuid',
                'exists:users,id',
                'different:nominator.connect',
            ],
            'nomineeReview' => [
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'nomineeRelationshipToNominator' => [
                Rule::in(array_column(TalentNominationNomineeRelationshipToNominator::cases(), 'name')),
            ],
            'nomineeRelationshipToNominatorOther' => [
                'required_if:nomineeRelationshipToNominator,'.TalentNominationNomineeRelationshipToNominator::OTHER->name,
                'prohibited_unless:nomineeRelationshipToNominator,'.TalentNominationNomineeRelationshipToNominator::OTHER->name,
                'nullable',
                'string',
            ],
            'nominateForAdvancement' => ['boolean'],
            'nominateForLateralMovement' => ['boolean'],
            'nominateForDevelopmentPrograms' => ['boolean'],

            'advancementReference.connect' => [
                'uuid',
                'exists:users,id',
                'prohibits:advancementReferenceFallbackWorkEmail,advancementReferenceFallbackName,advancementReferenceFallbackClassification.connect,advancementReferenceFallbackDepartment.connect',
            ],
            'advancementReferenceReview' => [
                'nullable',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'advancementReferenceFallbackWorkEmail' => ['nullable', new GovernmentEmailRegex],
            'advancementReferenceFallbackName' => ['string', 'nullable'],
            'advancementReferenceFallbackClassification.connect' => [
                'uuid',
                'exists:classifications,id',
            ],
            'advancementReferenceFallbackDepartment.connect' => [
                'uuid',
                'exists:departments,id',
            ],

            'lateralMovementOptions' => ['array'],
            'lateralMovementOptions.*' => [
                'distinct',
                Rule::in(array_column(TalentNominationLateralMovementOption::cases(), 'name')),
            ],
            'lateralMovementOptionsOther' => [
                'string',
                'nullable',
                Rule::requiredIf(in_array(TalentNominationLateralMovementOption::OTHER->name, $this->arg('lateralMovementOptions') ?? [])),
                Rule::prohibitedIf(! in_array(TalentNominationLateralMovementOption::OTHER->name, $this->arg('lateralMovementOptions') ?? [])),
            ],

            'developmentPrograms' => ['required_array_keys:sync'],
            'developmentPrograms.sync' => [
                'array',
                'exists:development_programs,id',
            ],
            'developmentProgramOptionsOther' => ['string', 'nullable'],

            'nominationRationale' => ['string'],
            'skills' => ['required_array_keys:sync'],
            'skills.sync' => [
                'array',
                'exists:skills,id',
                'distinct',
                Rule::when(fn ($args) => TalentNomination::find($args['id'])?->talentNominationEvent->include_leadership_competencies,
                    ['max:3'],
                    ['prohibited']
                ),
            ],
            'skills.sync.*' => [Rule::in(SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray())],
            'additionalComments' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'nominator.connect.exists' => ErrorCode::NOMINATOR_NOT_FOUND->name,
            'nominatorFallbackClassification.connect.exists' => ErrorCode::NOMINATOR_CLASSIFICATION_NOT_FOUND->name,
            'nominatorFallbackDepartment.connect.exists' => ErrorCode::NOMINATOR_DEPARTMENT_NOT_FOUND->name,
            'nominee.connect.exists' => ErrorCode::NOMINEE_NOT_FOUND->name,
            'advancementReference.connect.exists' => ErrorCode::ADVANCEMENT_REFERENCE_NOT_FOUND->name,
            'advancementReferenceFallbackClassification.connect.exists' => ErrorCode::ADVANCEMENT_REFERENCE_CLASSIFICATION_NOT_FOUND->name,
            'advancementReferenceFallbackDepartment.connect.exists' => ErrorCode::ADVANCEMENT_REFERENCE_DEPARTMENT_NOT_FOUND->name,
            'developmentPrograms.sync.exists' => ErrorCode::DEVELOPMENT_PROGRAM_NOT_FOUND->name,
            'skills.sync.exists' => ErrorCode::SKILL_NOT_FOUND->name,
            'skills.sync.*.in' => ErrorCode::SKILL_NOT_KLC->name,
            'skills.sync.prohibited' => ErrorCode::SKILLS_NOT_ALLOWED_FOR_EVENT->name,
        ];
    }
}
