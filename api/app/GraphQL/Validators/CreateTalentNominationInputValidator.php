<?php

namespace App\GraphQL\Validators;

use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationNomineeRelationshipToNominator;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\SkillFamily;
use App\Models\TalentNominationEvent;
use App\Rules\GovernmentEmailRegex;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateTalentNominationInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'talentNominationEvent.connect' => [
                'uuid',
                'required',
                'exists:talent_nomination_events,id',
            ],
            'nominator' => ['required_array_keys:connect'],
            'nominator.connect' => [
                'uuid',
                'exists:users,id',
                'prohibits:nominatorFallbackWorkEmail,nominatorFallbackName,nominatorFallbackClassification,nominatorFallbackDepartment',
            ],
            'submitterRelationshipToNominator' => [
                Rule::in(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name')),
            ],
            'submitterRelationshipToNominatorOther' => [
                'required_if:submitterRelationshipToNominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'prohibited_unless:submitterRelationshipToNominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'string',
            ],
            'nominatorFallbackWorkEmail' => [new GovernmentEmailRegex],
            'nominatorFallbackName' => ['string'],
            'nominatorFallbackClassification' => ['required_array_keys:connect'],
            'nominatorFallbackClassification.connect' => [
                'uuid',
                'exists:classifications,id',
            ],
            'nominatorFallbackDepartment' => ['required_array_keys:connect'],
            'nominatorFallbackDepartment.connect' => [
                'uuid',
                'exists:departments,id',
            ],
            'nominatorReview' => [
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
                Rule::when(fn () => TalentNominationEvent::find($this->arg('talentNominationEvent.connect'))->include_leadership_competencies,
                    ['max:3'],
                    ['prohibited']
                ),
            ],
            'skills.sync.*' => [Rule::in(SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray())],
            'additionalComments' => ['string'],
        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationEvent.connect.exists' => ApiErrorEnums::TALENT_NOMINATION_EVENT_NOT_FOUND,
            'nominator.connect.exists' => ApiErrorEnums::NOMINATOR_NOT_FOUND,
            'nominatorFallbackClassification.connect.exists' => ApiErrorEnums::NOMINATOR_CLASSIFICATION_NOT_FOUND,
            'nominatorFallbackDepartment.connect.exists' => ApiErrorEnums::NOMINATOR_DEPARTMENT_NOT_FOUND,
            'nominee.connect.exists' => ApiErrorEnums::NOMINEE_NOT_FOUND,
            'advancementReference.connect.exists' => ApiErrorEnums::ADVANCEMENT_REFERENCE_NOT_FOUND,
            'advancementReferenceFallbackClassification.connect.exists' => ApiErrorEnums::ADVANCEMENT_REFERENCE_CLASSIFICATION_NOT_FOUND,
            'advancementReferenceFallbackDepartment.connect.exists' => ApiErrorEnums::ADVANCEMENT_REFERENCE_DEPARTMENT_NOT_FOUND,
            'developmentPrograms.sync.exists' => ApiErrorEnums::DEVELOPMENT_PROGRAM_NOT_FOUND,
            'skills.sync.exists' => ApiErrorEnums::SKILL_NOT_FOUND,
            'skills.sync.*.in' => ApiErrorEnums::SKILL_NOT_KLC,
            'skills.sync.prohibited' => ApiErrorEnums::SKILLS_NOT_ALLOWED_FOR_EVENT,
        ];
    }
}
