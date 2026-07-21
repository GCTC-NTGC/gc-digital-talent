<?php

namespace App\Traits;

use App\Enums\TalentRequestSource;
use App\Models\CommunityInterest;
use App\Models\PoolCandidate;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A user's "sources" for a talent request: the records (per source kind) that satisfy the
 * request's applicant filter. Adding a source means a new match relation here plus an entry
 * in TalentRequestSource::matchRelation().
 */
trait HasTalentRequestSources
{
    // separate from poolCandidates so eager-loading the filtered matches never clobbers that relation
    /** @return HasMany<PoolCandidate, $this> */
    public function matchingQualifiedInPoolSources(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }

    /** @return HasMany<CommunityInterest, $this> */
    public function matchingAtLevelSources(): HasMany
    {
        return $this->hasMany(CommunityInterest::class);
    }

    /**
     * Records this user matched for one source's relation. Returns the records the
     * talent-request query already eager-loaded; otherwise runs the filtered query directly
     * (the talentRequest.trackedUsers path has no eager-load scope to lean on).
     *
     * @return Collection<int, Model>
     */
    public function talentRequestSourceMatches(string $relation, array $filters): Collection
    {
        if ($this->relationLoaded($relation)) {
            return $this->getRelation($relation);
        }

        return $this->{$relation}()
            ->whereMatchesTalentRequest($filters)
            ->whereAuthorizedToView()
            ->get();
    }

    /** @return array<string> */
    public function talentRequestSources(array $filters = []): array
    {
        $sources = [];

        foreach (TalentRequestSource::cases() as $source) {
            if (($relation = $source->matchRelation())
                && $this->talentRequestSourceMatches($relation, $filters)->isNotEmpty()) {
                $sources[] = $source->name;
            }
        }

        return $sources;
    }
}
