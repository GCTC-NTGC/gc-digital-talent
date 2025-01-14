<?php

namespace App\GraphQL\Validators;

use App\Enums\ExecCoaching;
use App\Enums\Mentorship;
use App\Enums\MoveInterest;
use App\Enums\OrganizationTypeInterest;
use App\Models\WorkStream;
use Database\Helpers\ApiErrorEnums;
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
        $communityId = $this->arg('dreamRoleCommunity.connect');
        $workStreams = $communityId ? WorkStream::where('community_id', $communityId)->get('id')->pluck('id') : [];

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

            'dreamRoleTitle' => ['nullable', 'string'],
            'dreamRoleAdditionalInformation' => ['nullable', 'string'],
            'dreamRoleCommunity.connect' => ['uuid', 'exists:communities,id'],
            'dreamRoleClassification.connect' => ['uuid', 'exists:classifications,id'],
            'dreamRoleWorkStream.connect' => ['prohibited_if:dreamRoleCommunity,null', 'uuid', 'exists:work_streams,id', Rule::in($workStreams)],
            'dreamRoleDepartments.sync.*' => ['uuid', 'exists:departments,id'],

            'aboutYou' => ['nullable', 'string'],
            'careerGoals' => ['nullable', 'string'],
            'learningGoals' => ['nullable', 'string'],
            'workStyle' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'dreamRoleCommunity.connect.exists' => ApiErrorEnums::COMMUNITY_NOT_FOUND,
            'dreamRoleClassification.connect.exists' => ApiErrorEnums::CLASSIFICATION_NOT_FOUND,
            'dreamRoleWorkStream.connect.exists' => ApiErrorEnums::WORK_STREAM_NOT_FOUND,
            'dreamRoleWorkStream.connect.in' => ApiErrorEnums::WORK_STREAM_NOT_IN_COMMUNITY,
            'dreamRoleDepartments.sync.*.exists' => ApiErrorEnums::DEPARTMENT_NOT_FOUND,
        ];
    }
}
