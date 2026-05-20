<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestClosedDetail;
use App\Rules\PoolCandidateSearchRequestIsClosed;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolCandidateSearchRequestClosedDetailsValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => [new PoolCandidateSearchRequestIsClosed],
            'closedDetails' => [Rule::in(array_column(TalentRequestClosedDetail::cases(), 'name'))],
        ];
    }
}
