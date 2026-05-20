<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidateSearchRequest;

final class UpdatePoolCandidateSearchRequestClosedDetails
{
    public function __invoke($_, array $args): PoolCandidateSearchRequest
    {
        $searchRequest = PoolCandidateSearchRequest::findOrFail($args['id']);
        $searchRequest->updateClosedDetails($args['closedDetails']);

        return $searchRequest;
    }
}
