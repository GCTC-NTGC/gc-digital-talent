<?php

namespace App\GraphQL\Validators;

use App\Enums\ExecCoaching;
use App\Enums\Mentorship;
use App\Enums\MoveInterest;
use App\Enums\OrganizationTypeInterest;
use App\Enums\TargetRole;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateEmployeeProfileInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        // args->has doesn't work with dotted syntax
        $argsArr = $this->args->toArray();

        $nextRoleCommunityId = $this->arg('nextRoleCommunity.connect');
        $careerObjectiveCommunityId = $this->arg('careerObjectiveCommunity.connect');
        $nextRoleAllWorkStreams = $nextRoleCommunityId ? WorkStream::where('community_id', $nextRoleCommunityId)->get('id')->pluck('id') : [];
        $careerObjectiveAllWorkStreams = $careerObjectiveCommunityId ? WorkStream::where('community_id', $careerObjectiveCommunityId)->get('id')->pluck('id') : [];

        return [
            'organizationTypeInterest' => ['nullable'],
            'organizationTypeInterest.*' => [Rule::in(array_column(OrganizationTypeInterest::cases(), 'name'))],
            'moveInterest' => ['nullable'],
            'moveInterest.*' => [Rule::in(array_column(MoveInterest::cases(), 'name'))],
            'mentorshipStatus' => ['nullable'],
            'mentorshipStatus.*' => [Rule::in(array_column(Mentorship::cases(), 'name'))],
            'mentorshipInterest' => ['nullable'],
            'mentorshipInterest.*' => [Rule::in(array_column(Mentorship::cases(), 'name'))],
            'execInterest' => ['nullable', 'boolean'],
            'execCoachingStatus' => ['nullable'],
            'execCoachingStatus.*' => [Rule::in(array_column(ExecCoaching::cases(), 'name'))],
            'execCoachingInterest' => ['nullable'],
            'execCoachingInterest.*' => [Rule::in(array_column(ExecCoaching::cases(), 'name'))],

            'nextRoleJobTitle' => ['nullable', 'string'],
            'careerObjectiveJobTitle' => ['nullable', 'string'],
            'nextRoleAdditionalInformation' => ['nullable', 'string'],
            'careerObjectiveAdditionalInformation' => ['nullable', 'string'],
            'nextRoleCommunity.connect' => ['uuid', 'exists:communities,id'],
            'careerObjectiveCommunity.connect' => ['uuid', 'exists:communities,id'],
            'nextRoleClassification.connect' => ['uuid', 'exists:classifications,id'],
            'careerObjectiveClassification.connect' => ['uuid', 'exists:classifications,id'],

            'nextRoleWorkStreams' => [
                Rule::when(
                    fn (): bool => Arr::has($argsArr, ('nextRoleCommunity.connect')),
                    [
                        'present', // if community is specified, work streams must also be specified
                        'nextRoleWorkStreams.sync' => ['required'],
                    ]
                ),
            ],
            'nextRoleWorkStreams.sync.*' => [
                'prohibited_if:nextRoleCommunity,null',
                'required_with:nextRoleCommunity,null',
                'uuid',
                'exists:work_streams,id',
                Rule::in($nextRoleAllWorkStreams),
            ],

            'careerObjectiveWorkStreams' => [
                Rule::when(
                    fn (): bool => Arr::has($argsArr, ('careerObjectiveCommunity.connect')),
                    [
                        'present', // if community is specified, work streams must also be specified
                        'careerObjectiveCommunity.sync' => ['required'],
                    ]
                ),
            ],
            'careerObjectiveWorkStreams.sync.*' => [
                'prohibited_if:careerObjectiveCommunity,null',
                'required_with:careerObjectiveCommunity,null',
                'uuid',
                'exists:work_streams,id',
                Rule::in($careerObjectiveAllWorkStreams),
            ],

            'nextRoleDepartments.sync.*' => ['uuid', 'exists:departments,id'],
            'careerObjectiveDepartments.sync.*' => ['uuid', 'exists:departments,id'],
            'nextRoleTargetRole' => [Rule::in(array_column(TargetRole::cases(), 'name'))],
            'careerObjectiveTargetRole' => [Rule::in(array_column(TargetRole::cases(), 'name'))],
            'nextRoleTargetRoleOther' => [
                Rule::when(
                    fn (): bool => Arr::has($argsArr, 'nextRoleTargetRole'),
                    ['present'] // if role is specified, other must be defined as a value or null
                ),
                'required_if:nextRoleTargetRole,'.TargetRole::OTHER->name,
                'prohibited_unless:nextRoleTargetRole,'.TargetRole::OTHER->name,
            ],
            'careerObjectiveTargetRoleOther' => [
                Rule::when(
                    fn (): bool => Arr::has($argsArr, 'careerObjectiveTargetRole'),
                    ['present'] // if role is specified, other must be defined as a value or null
                ),
                'required_if:careerObjectiveTargetRole,'.TargetRole::OTHER->name,
                'prohibited_unless:careerObjectiveTargetRole,'.TargetRole::OTHER->name,
            ],

            'aboutYou' => ['nullable', 'string'],
            'careerGoals' => ['nullable', 'string'],
            'learningGoals' => ['nullable', 'string'],
            'workStyle' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'nextRoleCommunity.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'careerObjectiveCommunity.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'nextRoleClassification.connect.exists' => ApiErrorEnums::CLASSIFICATION_NOT_FOUND,
            'careerObjectiveClassification.connect.exists' => ApiErrorEnums::CLASSIFICATION_NOT_FOUND,
            'nextRoleWorkStreams.sync.*.exists' => ApiErrorEnums::WORK_STREAM_NOT_FOUND,
            'nextRoleWorkStreams.sync.*.in' => ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY,
            'careerObjectiveWorkStreams.sync.*.exists' => ApiErrorEnums::WORK_STREAM_NOT_FOUND,
            'careerObjectiveWorkStreams.sync.*.in' => ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY,
            'nextRoleDepartments.sync.*.exists' => ApiErrorEnums::DEPARTMENT_NOT_FOUND,
            'careerObjectiveDepartments.sync.*.exists' => ApiErrorEnums::DEPARTMENT_NOT_FOUND,
        ];
    }
}
