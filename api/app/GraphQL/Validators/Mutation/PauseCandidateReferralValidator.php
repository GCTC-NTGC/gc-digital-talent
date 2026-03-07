<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ReferralPauseLength;
use App\Models\PoolCandidate;
use App\Rules\CanPauseCandidateReferral;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class PauseCandidateReferralValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->arg('id');
        $candidate = PoolCandidate::findOrFail($id);

        return [
            'id' => [
                'required',
                'uuid',
                'exists:pool_candidates,id',
                new CanPauseCandidateReferral,
            ],
            'referralPauseLength' => ['required', Rule::in(array_column(ReferralPauseLength::cases(), 'name'))],
            'referralUnpauseAt' => [
                Rule::when(
                    fn (): bool => $this->arg('referralPauseLength') === ReferralPauseLength::OTHER->name,
                    ['required', 'date', 'after:today', 'before_or_equal:'.$candidate->expiry_date]
                ),
            ],
            'referralPauseReason' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
