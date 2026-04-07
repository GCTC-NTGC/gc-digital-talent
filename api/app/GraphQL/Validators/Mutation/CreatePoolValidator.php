<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\Department;
use App\Models\Team;
use App\Models\User;
use Closure;
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
            Community::find($this->arg('communityId'))
            : null;
        $department = ($this->arg('pool'))['department'] && ($this->arg('pool'))['department']['connect'] ?
            Department::find(($this->arg('pool'))['department']['connect'])
             : null;

        /**
         * @var array<Team> $teams
         */
        $teams = $user->rolesTeams()->get();
        $teamIds = [];
        foreach ($teams as $team) {
            if ($user->isAbleTo('create-team-draftPool', $team)) {
                $teamIds[] = $team->id;
            }
        }

        $authorizedForCommunity = in_array($community?->team?->id, $teamIds);
        $authorizedForDepartment = in_array($department?->team?->id, $teamIds);

        return [
            'pool.department.connect' => [
                'required',
            ],
            'pool' => [
                function (string $attribute, mixed $value, Closure $fail) use ($authorizedForCommunity, $authorizedForDepartment) {
                    if (! ($authorizedForCommunity || $authorizedForDepartment)) {
                        $fail(ErrorCode::INVALID_COMMUNITY_DEPARTMENT_COMBO->name);
                    }
                },

            ],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
