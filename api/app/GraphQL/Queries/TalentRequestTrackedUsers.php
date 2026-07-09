<?php

namespace App\GraphQL\Queries;

use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use Illuminate\Database\Eloquent\Builder;

final class TalentRequestTrackedUsers
{
    public function query($_, array $args): Builder
    {
        $talentRequestId = $args['talentRequestId'];
        $where = $args['where'] ?? [];

        $matchFilters = TalentRequest::with([
            'applicantFilter.qualifiedInClassifications',
            'applicantFilter.qualifiedInWorkStreams',
        ])->find($talentRequestId)?->applicantFilter?->toMatchFilters() ?? [];

        return TalentRequestTrackedUser::query()
            ->where('talent_request_id', $talentRequestId)
            ->whereAuthorizedToView()
            ->withSkillCount()
            ->withTalentRequestMatches($talentRequestId)
            ->whereStatusIn($where['statuses'] ?? null)
            ->whereUserNameOrEmail($where['generalSearch'] ?? null)
            ->whereHasTalentSource($where['sources'] ?? null, $matchFilters);
    }
}
