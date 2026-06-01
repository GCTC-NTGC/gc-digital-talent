<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Models\PoolCandidate;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class PlaceCandidateValidator extends Validator
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

        if ($candidate->application_status !== ApplicationStatus::QUALIFIED->name) {
            throw ValidationException::withMessages(['id' => ErrorCode::INVALID_STATUS_PLACING->name]);
        }

        $placementType = $this->arg('poolCandidate.placementType');
        $hasPlacedStartDate = $placementType !== PlacementType::NOT_PLACED->name &&
            $placementType !== PlacementType::UNDER_CONSIDERATION->name &&
            $placementType !== PlacementType::PLACED_TENTATIVE->name;
        $isIndeterminate = $placementType === PlacementType::PLACED_INDETERMINATE->name;

        return [
            'poolCandidate.department.connect' => ['uuid', 'required', Rule::exists('departments', 'id')],
            'poolCandidate.placementType' => [Rule::in(array_column(PlacementType::cases(), 'name'))],
            'poolCandidate.placedStartDate' => [Rule::when(fn (): bool => $hasPlacedStartDate, ['nullable', 'date'])],
            'poolCandidate.placedEndDate' => [
                Rule::when(fn (): bool => $hasPlacedStartDate && !$isIndeterminate,
                ['nullable', 'date', 'after:poolCandidate.placedStartDate']
            )],
        ];
    }

    public function messages(): array
    {
        return [
            'exists' => ':attribute does not exist.',
        ];
    }
}
