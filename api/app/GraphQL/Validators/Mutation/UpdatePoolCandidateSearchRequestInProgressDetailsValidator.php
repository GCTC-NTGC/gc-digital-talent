<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestInProgressDetail;
use App\Rules\PoolCandidateSearchRequestIsInProgress;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolCandidateSearchRequestInProgressDetailsValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => [new PoolCandidateSearchRequestIsInProgress],
            'inProgressDetails' => [Rule::in(array_column(TalentRequestInProgressDetail::cases(), 'name'))],
        ];
    }
}
