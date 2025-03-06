<?php

namespace App\GraphQL\Validators;

use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\DevelopmentProgram;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Support\Facades\Auth;
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
        // this is injected into the mutation by a schema directive but does not show up in the $args array
        $submitterId = Auth::user()->id;
        // $communityId = $this->arg('community.connect');
        // $workStreams = $communityId ? WorkStream::where('community_id', $communityId)->get('id')->pluck('id') : [];
        // $developmentProgramIds = $communityId ? DevelopmentProgram::where('community_id', $communityId)->get('id')->pluck('id') : [];

        return [
            'talentNominationEvent.connect' => ['uuid', 'required', 'exists:talent_nomination_events,id'],
            'nominator' => ['required_array_keys:connect'],
            'nominator.connect' => [
                'uuid',
                'exists:users,id',
                'prohibits:nominatorFallbackWorkEmail,nominatorFallbackName,nominatorFallbackClassification,nominatorFallbackDepartment',
            ],
            'submitterRelationshipToNominator' => [
                'required_if:nominator.connect,'.$submitterId,
                'prohibited_unless:nominator.connect,'.$submitterId,
                // Rule::when(
                //     fn (): bool => $this->arg('nominator.connect') !== $submitterId,
                //     ['filled']
                // ),
                // Rule::when(
                //     fn (): bool => $this->arg('nominator.connect') == $submitterId,
                //     ['prohibited']
                // ),
                Rule::in(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name')),
            ],
            'submitterRelationshipToNominatorOther' => [
                Rule::when(
                    fn (): bool => $this->arg('submitterRelationshipToNominator') == TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                    ['filled']
                ),
                Rule::when(
                    fn (): bool => $this->arg('submitterRelationshipToNominator') !== TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                    ['prohibited']
                ),
                'string',
            ],
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
                'required_with:nominator',
                'prohibited_if:nominator,null',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],

            'nominee' => ['required_array_keys:connect'],
            'nominee.connect' => [
                'uuid',
                'exists:users,id',
            ],
            'nomineeReview' => [
                'required_with:nominee',
                'prohibited_if:nominee,null',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],

            // When a nominator has been specified that is different from the current user...

            // 'workStreams.sync.*' => ['uuid', 'exists:work_streams,id', Rule::in($workStreams)],
            // 'jobInterest' => ['nullable', 'boolean'],
            // 'trainingInterest' => ['nullable', 'boolean'],
            // 'additionalInformation' => ['nullable', 'string'],
            // 'interestInDevelopmentPrograms.create.*.developmentProgramId' => ['uuid', Rule::in($developmentProgramIds)],
        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationEvent.connect.exists' => ApiErrorEnums::TALENT_NOMINATION_EVENT_NOT_FOUND,

        ];
    }
}
