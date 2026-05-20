<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestInProgressDetail;
use App\Rules\CanProgressPoolCandidateSearchRequest;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class ProgressPoolCandidateSearchRequestValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => [new CanProgressPoolCandidateSearchRequest],
            'inProgressDetails' => [Rule::in(array_column(TalentRequestInProgressDetail::cases(), 'name'))],
        ];
    }
}
