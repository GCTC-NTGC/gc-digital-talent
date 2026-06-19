<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Models\Pool;
use App\Models\PoolCandidate;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateSpecialApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $poolCandidateInput = $this->arg('poolCandidate');
        $poolId = $poolCandidateInput['pool']['connect'];
        $userId = $poolCandidateInput['user']['connect'];

        $pool = Pool::findOrFail($poolId)->select(['closing_date'])->first();

        $poolCandidate = PoolCandidate::where('pool_id', $poolId)
            ->where('user_id', $userId)
            ->select(['submitted_at'])
            ->first();

        if ($poolCandidate) {
            // existing pool candidate allowed if it wasn't submitted
            if ($poolCandidate->submitted_at) {
                throw ValidationException::withMessages(['id' => ErrorCode::SPECIAL_APPLICATIONS_USER_ALREADY_APPLIED->name]);
            }
        }

        return [
            'poolCandidate.pool.connect' => [
                'required',
                'uuid',
                'exists:pools,id',
            ],
            'poolCandidate.user.connect' => [
                'required',
                'uuid',
                'exists:users,id',
            ],

            'poolCandidate.specialApplicationType' => ['required'],
            'poolCandidate.specialApplicationJustification' => ['required'],
            'poolCandidate.specialApplicationClosingDate' => [
                'required',
                'after:today',
                'after_or_equal:'.$pool['closing_date'],
            ],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
