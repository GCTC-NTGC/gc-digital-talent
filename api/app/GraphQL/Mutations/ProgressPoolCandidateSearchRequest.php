<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidateSearchRequest;

final class ProgressPoolCandidateSearchRequest
{
    public function __invoke($_, array $args): PoolCandidateSearchRequest
    {
        $searchRequest = PoolCandidateSearchRequest::findOrFail($args['id']);
        $searchRequest->progress($args['inProgressDetails'], $args['followUpDate'] ?? null);

        return $searchRequest;
    }
}
