<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\TalentRequestStatus;
use App\Models\PoolCandidateSearchRequest;

final class UpdatePoolCandidateSearchRequestStatus
{
    public function __invoke($_, array $args): PoolCandidateSearchRequest
    {
        $searchRequest = PoolCandidateSearchRequest::findOrFail($args['id']);

        if ($args['status'] === TalentRequestStatus::IN_PROGRESS->name) {
            $searchRequest->progress($args['inProgressDetails'], $args['followUpDate'] ?? null);
        } elseif ($args['status'] === TalentRequestStatus::COMPLETED->name) {
            $searchRequest->complete($args['completionDetails']);
        }

        return $searchRequest;
    }
}
