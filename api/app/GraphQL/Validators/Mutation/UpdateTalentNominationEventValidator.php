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

        // for active events additional rules apply
        // prevent moving closing date sooner
        // cannot change the community or event name
        // prevent changing opening date
        $thisEvent = TalentNominationEvent::findOrFail($this->arg('id'));
        /** @var TalentNominationEvent $thisEvent */
        $eventStatus = $thisEvent->status;

        $storedOpenDate = $thisEvent->open_date;
        $storedCloseDate = $thisEvent->close_date ?? null;

        $communityId = $eventStatus === TalentNominationEventStatus::ACTIVE->name
            ? $thisEvent->community_id
            : $this->arg('talentNominationEvent.community.connect');

        $attachedCommunityDevelopmentProgramIds = $thisEvent->communityDevelopmentPrograms()
            ->withTrashed()
            ->pluck('community_development_program.id')
            ->all();

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
                    ->where(function ($query) use ($communityId, $attachedCommunityDevelopmentProgramIds) {
                        $query->where('community_id', $communityId)
                            ->orWhereIn('id', $attachedCommunityDevelopmentProgramIds);
                    }),
            ],
            'talentNominationEvent.name' => ['localized_string'],
            'talentNominationEvent.name.en' => [
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name,
                    [
                        new ValueIsIdentical($thisEvent->name['en']),
                    ]
                ),
            ],
            'talentNominationEvent.name.fr' => [
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name,
                    [
                        new ValueIsIdentical($thisEvent->name['fr']),
                    ]
                ),
            ],
            'talentNominationEvent.description' => ['nullable', 'localized_string'],
            'talentNominationEvent.learnMoreUrl' => ['nullable', 'localized_string:nullable,url'],
            'talentNominationEvent.openDate' => [
                'date',
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name,
                    [
                        'date_equals:'.$storedOpenDate,
                    ]
                ),
            ],
            'talentNominationEvent.closeDate' => [
                'date',
                'after:openDate',
                Rule::when(
                    $eventStatus === TalentNominationEventStatus::ACTIVE->name && $storedCloseDate,
                    ['after_or_equal:'.$storedCloseDate]
                ),
            ],
            'talentNominationEvent.includeLeadershipCompetencies' => ['nullable', 'boolean'],
            'talentNominationEvent.includeNineBox' => ['sometimes', 'boolean'],
            'talentNominationEvent.requireReferenceForAdvancement' => ['sometimes', 'boolean'],
            'talentNominationEvent.customInstructions' => ['nullable', 'localized_string'],
            'talentNominationEvent.contactEmail' => ['required', 'email'],
        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationEvent.community.connect.App\\Rules\\ValueIsIdentical' => ErrorCode::TALENT_EVENT_CANNOT_CHANGE_COMMUNITY->name,
            'talentNominationEvent.community.connect.exists' => ErrorCode::COMMUNITY_NOT_FOUND->name,
            'talentNominationEvent.communityDevelopmentPrograms.sync.*.id.exists' => ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND_OR_INVALID->name,
            'talentNominationEvent.name.en.App\\Rules\\ValueIsIdentical' => ErrorCode::TALENT_EVENT_CANNOT_CHANGE_NAME->name,
            'talentNominationEvent.name.fr.App\\Rules\\ValueIsIdentical' => ErrorCode::TALENT_EVENT_CANNOT_CHANGE_NAME->name,
        ];
    }
}
