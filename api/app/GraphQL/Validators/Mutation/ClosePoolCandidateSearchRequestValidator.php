<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestClosedDetail;
use App\Rules\CanClosePoolCandidateSearchRequest;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class ClosePoolCandidateSearchRequestValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => [new CanClosePoolCandidateSearchRequest],
            'closedDetails' => [Rule::in(array_column(TalentRequestClosedDetail::cases(), 'name'))],
        ];
    }
}
