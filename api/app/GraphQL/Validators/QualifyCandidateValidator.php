<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Enums\ReferralPauseLength;
use App\Models\PoolCandidate;
use App\Rules\UnpauseAtBeforeExpiryDate;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class QualifyCandidateValidator extends Validator
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
        $startOfDay = Carbon::now()->startOfDay();

        if ($candidate->application_status !== ApplicationStatus::TO_ASSESS->name) {
            throw ValidationException::withMessages(['status' => ErrorCode::INVALID_STATUS_QUALIFICATION->name]);
        }

        return [
            'poolCandidate.expiryDate' => ['required', 'after_or_equal:'.$startOfDay],
            'poolCandidate.referralPause.referralPauseLength' => [
                Rule::when(
                    fn (): bool => $this->arg('poolCandidate.placementType') !== PlacementType::PLACED_INDETERMINATE->name,
                    [Rule::in(array_column(ReferralPauseLength::cases(), 'name'))]
                ),
                new UnpauseAtBeforeExpiryDate($this->arg('poolCandidate.referralPause')),
            ],
            'poolCandidate.referralPause.referralUnpauseAt' => [
                Rule::when(
                    fn (): bool => $this->arg('poolCandidate.referralPause.referralPauseLength') === ReferralPauseLength::OTHER->name,
                    ['date', 'after:'.$startOfDay, 'before_or_equal:poolCandidate.expiryDate']
                ),
            ],
            'poolCandidate.referralPause.referralPauseReason' => ['string'],
        ];
    }

    public function messages(): array
    {
        return [
            'poolCandidate.expiryDate.required' => ErrorCode::EXPIRY_DATE_REQUIRED->name,
            'poolCandidate.expiryDate.after' => ErrorCode::EXPIRY_DATE_AFTER_TODAY->name,
        ];
    }
}
