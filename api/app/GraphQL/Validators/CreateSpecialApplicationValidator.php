<?php

namespace App\GraphQL\Validators;

use App\Models\Pool;
use App\Rules\PoolCandidateDraftOrNonExistent;
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

        $pool = Pool::query()->select('closing_date')->findOrFail($poolId);

        return [
            'poolCandidate' => [new PoolCandidateDraftOrNonExistent($poolId, $userId)],
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
                'after:'.$pool['closing_date'],
            ],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
