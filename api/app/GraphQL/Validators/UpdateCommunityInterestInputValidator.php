<?php

namespace App\GraphQL\Validators;

use App\Models\CommunityInterest;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateCommunityInterestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityId = CommunityInterest::with('community')->find($this->arg('id'))?->community?->id;
        $workStreams = $communityId ? WorkStream::where('community_id', $communityId)->get('id')->pluck('id') : [];

        return [
            'workStreams.sync.*' => ['uuid', 'exists:work_streams,id', Rule::in($workStreams)],
            'jobInterest' => ['nullable', 'boolean'],
            'trainingInterest' => ['nullable', 'boolean'],
            'additionalInformation' => ['nullable', 'string'],
            'interestInDevelopmentPrograms.create.*.developmentProgramId' => [Rule::exists('development_programs', 'id')->where('community_id', $communityId)],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'workStreams.sync.*.in' => ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY,
            'workStreams.sync.*.exists' => ApiErrorEnums::WORK_STREAM_NOT_FOUND,
            'interestInDevelopmentPrograms.create.*.developmentProgramId' => ApiErrorEnums::DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY,
        ];
    }
}
