<?php

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;

class PoolCandidateBuilder extends Builder
{
    /**
     * Scopes the query to return PoolCandidates in a specified community via the relation chain candidate->pool->community
     */
    public function whereHasPoolCandidateCommunity(?string $communityId): self
    {
        if (empty($communityId)) {
            return $this;
        }

        return $this->whereHas('pool', function ($query) use ($communityId) {
            $query->where('community_id', $communityId);
        });
    }
}
