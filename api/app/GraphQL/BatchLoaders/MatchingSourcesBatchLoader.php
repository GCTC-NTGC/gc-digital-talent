<?php

namespace App\GraphQL\BatchLoaders;

use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use GraphQL\Deferred;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Batches the per-source match lookups for a page of tracked users into one query per
 * source, so the tracking list does not run a match query per row (issue #17468).
 *
 * One instance is created per GraphQL field path (see BatchLoaderRegistry), so every row's
 * matching*Sources field for the same list shares this loader. All rows on a page belong to
 * the same talent request, so they share one set of match filters.
 */
final class MatchingSourcesBatchLoader
{
    /** @var array<string, TalentRequestTrackedUser> keyed by the tracked user's user_id */
    protected array $userIds = [];

    /** @var array<string, Collection<int, Model>> keyed by user_id */
    protected array $results = [];

    protected bool $hasResolved = false;

    /**
     * @param  string  $relation  the User relation holding this source's matches
     * @param  array<string, mixed>  $filters  match filters from the request's applicant filter
     */
    public function __construct(
        protected string $relation,
        protected array $filters,
    ) {}

    public function load(TalentRequestTrackedUser $trackedUser): Deferred
    {
        $userId = $trackedUser->user_id;
        $this->userIds[$userId] = $trackedUser;

        return new Deferred(function () use ($userId) {
            if (! $this->hasResolved) {
                $this->resolve();
            }

            return $this->results[$userId] ?? new Collection();
        });
    }

    protected function resolve(): void
    {
        $relation = (new User())->{$this->relation}();
        $foreignKey = $relation->getForeignKeyName();

        $matches = $relation->getRelated()->newQuery()
            ->whereIn($foreignKey, array_keys($this->userIds))
            ->whereMatchesTalentRequest($this->filters)
            ->whereAuthorizedToView()
            ->get()
            ->groupBy($foreignKey);

        foreach (array_keys($this->userIds) as $userId) {
            $this->results[$userId] = $matches->get($userId) ?? new Collection();
        }

        $this->hasResolved = true;
    }
}
