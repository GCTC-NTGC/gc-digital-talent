<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\TalentNominationEventStatus;
use App\Models\CommunityDevelopmentProgram;
use App\Models\TalentNominationEvent;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentNominationEventInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityId = $this->arg('talentNominationEvent.community.connect');
        $communityDevelopmentProgramIds = $communityId ?
            CommunityDevelopmentProgram::where('community_id', $communityId)->get('id')->pluck('id')
            : [];

        // for active event prevent moving closing date sooner
        $thisEvent = TalentNominationEvent::find($this->arg('id'));
        /** @var TalentNominationEvent $thisEvent */
        $eventStatus = $thisEvent->status;
        $storedCloseDate = $thisEvent->close_date ?? null;

        return [
            'talentNominationEvent.community.connect' => ['uuid', 'exists:communities,id'],
            'talentNominationEvent.communityDevelopmentPrograms.sync.*.id' => [
                'uuid',
                'exists:community_development_program,id',
                Rule::in($communityDevelopmentProgramIds),
            ],
            'talentNominationEvent.description.en' => ['nullable', 'required_with:description.fr', 'string'],
            'talentNominationEvent.description.fr' => ['nullable', 'required_with:description.en', 'string'],
            'talentNominationEvent.learnMoreUrl.en' => ['nullable', 'required_with:learnMoreUrl.fr', 'string', 'url'],
            'talentNominationEvent.learnMoreUrl.fr' => ['nullable', 'required_with:learnMoreUrl.en', 'string', 'url'],
            'talentNominationEvent.openDate' => ['date'],
            'talentNominationEvent.closeDate' => [
                'date',
                'after:openDate',
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name && $storedCloseDate,
                    ['after_or_equal:'.$storedCloseDate]
                ),
            ],
            'talentNominationEvent.includeLeadershipCompetencies' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationEvent.community.connect.exists' => ErrorCode::COMMUNITY_NOT_FOUND->name,
            'talentNominationEvent.communityDevelopmentPrograms.sync.*.id.exists' => ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND->name,
            'talentNominationEvent.communityDevelopmentPrograms.sync.*.id.in' => ErrorCode::DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY->name,
        ];
    }
}
