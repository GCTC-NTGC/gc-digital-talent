<?php

namespace App\GraphQL\Validators;

use App\Models\DevelopmentProgram;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateCommunityInterestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $communityId = $this->arg('community.connect');
        $workStreams = $communityId ? WorkStream::where('community_id', $communityId)->get('id')->pluck('id') : [];
        $developmentProgramIds = $communityId ? DevelopmentProgram::where('community_id', $communityId)->get('id')->pluck('id') : [];

        return [
            'userId' => ['uuid', 'required', 'exists:users,id'],
            'community.connect' => ['uuid', 'required', 'exists:communities,id', Rule::unique('community_interests', 'community_id')->where(function ($query) {
                return $query->where('user_id', $this->arg('userId'));
            })],
            'workStreams.sync.*' => ['uuid', 'exists:work_streams,id', Rule::in($workStreams)],
            'jobInterest' => ['nullable', 'boolean'],
            'trainingInterest' => ['nullable', 'boolean'],
            'additionalInformation' => ['nullable', 'string'],
            'interestInDevelopmentPrograms.create.*.developmentProgramId' => ['uuid', Rule::in($developmentProgramIds)],
        ];
    }

    public function messages(): array
    {
        return [
            'community.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'community.connect.unique' => ApiErrorEnums::COMMUNITY_INTEREST_EXISTS,
            'workStreams.sync.*.in' => ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY,
            'workStreams.sync.*.exists' => ApiErrorEnums::WORK_STREAM_NOT_FOUND,
            'interestInDevelopmentPrograms.create.*.developmentProgramId.in' => ApiErrorEnums::DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY,
        ];
    }
}
