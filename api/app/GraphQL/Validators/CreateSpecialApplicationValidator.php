<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\SpecialApplicationType;
use App\Models\Pool;
use App\Rules\PoolCandidateDraftOrNonExistent;
use Carbon\Carbon;
use Closure;
use Illuminate\Validation\Rule;
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
        $poolId = $this->arg('poolCandidate.pool.connect');
        $userId = $this->arg('poolCandidate.user.connect');

        $pool = Pool::query()->select(['published_at', 'closing_date', 'archived_at'])->findOrFail($poolId);

        return [
            'poolCandidate' => [new PoolCandidateDraftOrNonExistent($poolId, $userId)],
            'poolCandidate.pool.connect' => [
                'required',
                'uuid',
                'exists:pools,id',
                function (string $attribute, mixed $value, Closure $fail) use ($pool) {
                    if (
                        // block un-published or archived, including blocks of future published_at and allowing future archived_at
                        is_null($pool['published_at']) ||
                        Carbon::now()->lt($pool['published_at']) ||
                        (
                            (! is_null($pool['archived_at'])) && Carbon::now()->gte($pool['archived_at'])
                        )
                    ) {
                        $fail(ErrorCode::SPECIAL_APPLICATIONS_POOL_NOT_PUBLISHED->name);
                    }
                },
            ],
            'poolCandidate.user.connect' => [
                'required',
                'uuid',
                'exists:users,id',
            ],

            'poolCandidate.specialApplicationType' => ['required',
                Rule::in(array_column(SpecialApplicationType::cases(), 'name')),
            ],
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
