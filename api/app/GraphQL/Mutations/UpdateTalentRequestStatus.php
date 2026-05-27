<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\TalentRequestStatus;
use App\Models\TalentRequest;

final class UpdateTalentRequestStatus
{
    public function __invoke($_, array $args): TalentRequest
    {
        $talentRequest = TalentRequest::findOrFail($args['id']);

        if ($args['status'] === TalentRequestStatus::IN_PROGRESS->name) {
            $talentRequest->progress($args['inProgressDetails'], $args['followUpDate'] ?? null);
        } elseif ($args['status'] === TalentRequestStatus::CLOSED->name) {
            $talentRequest->complete($args['completeDetails']);
        }

        return $talentRequest;
    }
}
