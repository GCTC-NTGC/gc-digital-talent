<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\PauseReferralsLength;
use App\Models\PoolCandidate;
use App\Rules\CanPauseCandidateReferral;
use App\Rules\ResumeReferralsBeforeExpiryDate;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class PauseCandidateReferralsValidator extends Validator
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
                new CanPauseCandidateReferral(),
            ],
            'pauseReferrals.pauseReferralsLength' => [
                'required',
                Rule::in(array_column(PauseReferralsLength::cases(), 'name')),
                new ResumeReferralsBeforeExpiryDate($this->arg('pauseReferrals')),
            ],
            'pauseReferrals.resumeReferralsAt' => [
                Rule::when(
                    fn (): bool => $this->arg('pauseReferralsLength') === PauseReferralsLength::OTHER->name,
                    ['required', 'date', 'after:today', 'before_or_equal:'.$candidate->expiry_date]
                ),
            ],
            'pauseReferrals.pauseReferralsReason' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
