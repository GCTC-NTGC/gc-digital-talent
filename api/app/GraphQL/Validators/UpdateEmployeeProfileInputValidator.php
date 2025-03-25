<?php

namespace App\GraphQL\Validators;

use App\Enums\ExecCoaching;
use App\Enums\Mentorship;
use App\Enums\OrganizationTypeInterest;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Models\WorkStream;
use Carbon\Carbon;
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

        $beginningOfYear = Carbon::now()->startOfYear();
        $maxRetirementYear = Carbon::now()->addYears(35);

        $nextRoleCommunityId = $this->arg('nextRoleCommunity.connect');
        $careerObjectiveCommunityId = $this->arg('careerObjectiveCommunity.connect');
        $nextRoleAllWorkStreams = $nextRoleCommunityId ? WorkStream::where('community_id', $nextRoleCommunityId)->get('id')->pluck('id') : [];
        $careerObjectiveAllWorkStreams = $careerObjectiveCommunityId ? WorkStream::where('community_id', $careerObjectiveCommunityId)->get('id')->pluck('id') : [];

        return [
            'lateralMoveInterest' => ['nullable', 'boolean'],
            'lateralMoveTimeFrame' => ['nullable', Rule::in(array_column(TimeFrame::cases(), 'name')), 'required_if:lateralMoveInterest,true'],
            'lateralMoveOrganizationType' => ['nullable', 'required_if:lateralMoveInterest,true'],
            'lateralMoveOrganizationType.*' => [Rule::in(array_column(OrganizationTypeInterest::cases(), 'name'))],

            'promotionMoveInterest' => ['nullable', 'boolean'],
            'promotionMoveTimeFrame' => ['nullable', Rule::in(array_column(TimeFrame::cases(), 'name')), 'required_if:promotionMoveInterest,true'],
            'promotionMoveOrganizationType' => ['nullable', 'required_if:promotionMoveInterest,true'],
            'promotionMoveOrganizationType.*' => [Rule::in(array_column(OrganizationTypeInterest::cases(), 'name'))],

            'interchangeOpportunitiesInterest' => ['nullable', 'boolean'],
            'academicProgramInterest' => ['nullable', 'boolean'],
            'peerNetworkingInterest' => ['nullable', 'boolean'],
            'professionalAccreditationInterest' => ['nullable', 'boolean'],

            'eligibleRetirementYearKnown' => ['nullable', 'boolean'],
            'eligibleRetirementYear' => [
                'nullable',
                'date',
                'required_if:eligibleRetirementYearKnown,true',
                'after_or_equal:'.$beginningOfYear,
                'before:'.$maxRetirementYear,
            ],

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

            'nextRoleCommunity.connect' => [
                'uuid',
                'exists:communities,id',
                'nullable',
                Rule::prohibitedIf(
                    (
                        $this->arg('nextRoleCommunityOther') !== null
                    )
                ),
            ],
            'careerObjectiveCommunity.connect' => [
                'uuid',
                'exists:communities,id',
                'nullable',
                Rule::prohibitedIf(
                    (
                        $this->arg('careerObjectiveCommunityOther') !== null
                    )
                ),
            ],
            'nextRoleCommunityOther' => [
                'string',
                'nullable',
                Rule::prohibitedIf(
                    (
                        $this->arg('nextRoleCommunity.connect') !== null
                    )
                ),
            ],
            'careerObjectiveCommunityOther' => [
                'string',
                'nullable',
                Rule::prohibitedIf(
                    (
                        $this->arg('careerObjectiveCommunity.connect') !== null
                    )
                ),
            ],

            'nextRoleClassification.connect' => ['uuid', 'exists:classifications,id'],
            'careerObjectiveClassification.connect' => ['uuid', 'exists:classifications,id'],

            'nextRoleWorkStreams' => [
                Rule::when(
                    fn (): bool => (Arr::has($argsArr, ('nextRoleCommunity.connect'))),
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
                Rule::prohibitedIf(
                    (
                        $this->arg('nextRoleCommunityOther') !== null
                    )
                ),
            ],

            'careerObjectiveWorkStreams' => [
                Rule::when(
                    fn (): bool => (Arr::has($argsArr, ('careerObjectiveCommunity.connect'))),
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
                Rule::prohibitedIf(
                    (
                        $this->arg('careerObjectiveCommunityOther') !== null
                    )
                ),
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
            'learningGoals' => ['nullable', 'string'],
            'workStyle' => ['nullable', 'string'],

            'nextRoleIsCSuiteRole' => ['boolean'],
            'careerObjectiveIsCSuiteRole' => ['boolean'],
            'nextRoleCSuiteRoleTitle' => [
                'nullable',
                'string',
                'required_if:nextRoleIsCSuiteRole,true',
                'prohibited_if:nextRoleIsCSuiteRole,false',
            ],
            'careerObjectiveCSuiteRoleTitle' => [
                'nullable',
                'string',
                'required_if:careerObjectiveIsCSuiteRole,true',
                'prohibited_if:careerObjectiveIsCSuiteRole,false',
            ],
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
