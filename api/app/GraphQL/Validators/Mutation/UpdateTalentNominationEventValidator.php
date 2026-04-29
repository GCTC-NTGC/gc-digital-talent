<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Enums\TalentNominationEventStatus;
use App\Models\TalentNominationEvent;
use App\Rules\ValueIsIdentical;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentNominationEventValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityId = $this->arg('talentNominationEvent.community.connect');

        // for active events additional rules apply
        // prevent moving closing date sooner
        // cannot change the community or event name
        $thisEvent = TalentNominationEvent::findOrFail($this->arg('id'));
        /** @var TalentNominationEvent $thisEvent */
        $eventStatus = $thisEvent->status;

        $storedCloseDate = $thisEvent->close_date ?? null;

        return [
            'talentNominationEvent.community.connect' => [
                'uuid',
                'exists:communities,id',
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name,
                    [
                        new ValueIsIdentical($thisEvent->community_id),
                    ]
                ),
            ],
            'talentNominationEvent.communityDevelopmentPrograms.sync.*.id' => [
                'uuid',
                Rule::exists('community_development_program', 'id')
                    ->where(function ($query) use ($communityId) {
                        $query->where('community_id', $communityId);
                    }),
            ],
            'talentNominationEvent.name.en' => [
                'required_with:name.fr',
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name,
                    [
                        new ValueIsIdentical($thisEvent->name['en']),
                    ]
                ),
            ],
            'talentNominationEvent.name.fr' => [
                'required_with:name.en',
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name,
                    [
                        new ValueIsIdentical($thisEvent->name['fr']),
                    ]
                ),
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
            'talentNominationEvent.community.connect.App\\Rules\\ValueIsIdentical' => ErrorCode::TALENT_EVENT_CANNOT_CHANGE_COMMUNITY->name,
            'talentNominationEvent.community.connect.exists' => ErrorCode::COMMUNITY_NOT_FOUND->name,
            'communityDevelopmentPrograms.sync.*.id.exists' => ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND_OR_INVALID->name,
            'talentNominationEvent.name.en.App\\Rules\\ValueIsIdentical' => ErrorCode::TALENT_EVENT_CANNOT_CHANGE_NAME->name,
            'talentNominationEvent.name.fr.App\\Rules\\ValueIsIdentical' => ErrorCode::TALENT_EVENT_CANNOT_CHANGE_NAME->name,
        ];
    }
}
