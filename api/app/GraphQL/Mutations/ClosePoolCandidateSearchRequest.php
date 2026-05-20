<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidateSearchRequest;

final class ClosePoolCandidateSearchRequest
{
    public function __invoke($_, array $args): PoolCandidateSearchRequest
    {
        $searchRequest = PoolCandidateSearchRequest::findOrFail($args['id']);
        $searchRequest->close($args['closedDetails']);

        return $searchRequest;
    }
}
