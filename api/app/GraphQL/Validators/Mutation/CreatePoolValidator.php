<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\Department;
use App\Models\User;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class CreatePoolValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        // user must be able to a create a pool in the department OR community
        // this must be validated in the scenario of users with multiple roles allowing more options
        $user = User::find($this->arg('userId'));
        $community = ! is_null($this->arg('communityId')) ?
            Community::find($this->arg('communityId'))->loadMissing('team')
            : null;
        $department = ($this->arg('pool'))['department'] && ($this->arg('pool'))['department']['connect'] ?
            Department::find(($this->arg('pool'))['department']['connect'])->loadMissing('team')
             : null;

        /**
         * @var array<\App\Models\Team> $teams
         */
        $teams = $user->rolesTeams()->get();
        $teamIds = [];
        foreach ($teams as $team) {
            if ($user->isAbleTo('create-team-draftPool', $team)) {
                $teamIds[] = $team->id;
            }
        }

        $authorizedForCommunity = ($community && $community->team->id && in_array($community->team->id, $teamIds));
        $authorizedForDepartment = ($department && $department->team->id && in_array($department->team->id, $teamIds));

        if (
            ! ($authorizedForCommunity || $authorizedForDepartment)
        ) {
            throw ValidationException::withMessages(['id' => ErrorCode::INVALID_COMMUNITY_DEPARTMENT_COMBO->name]);
        }

        return [
            'pool.department.connect' => [
                'required',
            ],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
