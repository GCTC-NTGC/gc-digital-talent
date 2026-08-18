<?php

namespace App\GraphQL\BatchLoaders;

use App\Enums\TalentRequestSource;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use GraphQL\Deferred;

final class SourcesBatchLoader
{
    /** @var array<string, true> keyed by the tracked user's user_id */
    protected array $userIds = [];

    /** @var array<string, list<string>> keyed by user_id, value is matched source names */
    protected array $results = [];

    protected bool $hasResolved = false;

    /** @param  array<string, mixed>  $filters  match filters from the request's applicant filter */
    public function __construct(
        protected array $filters,
    ) {}

    public function load(TalentRequestTrackedUser $trackedUser): Deferred
    {
        $userId = $trackedUser->user_id;
        $this->userIds[$userId] = true;

        return new Deferred(function () use ($userId) {
            if (! $this->hasResolved) {
                $this->resolve();
            }

            return $this->results[$userId] ?? [];
        });
    }

    protected function resolve(): void
    {
        $selected = TalentRequestSource::selected($this->filters['talentSources'] ?? null);

        $matchedUserIdsBySource = [];
        foreach ($selected as $source) {
            $relation = (new User())->{$source->matchRelation()}();
            $foreignKey = $relation->getForeignKeyName();

            $matchedUserIdsBySource[$source->name] = $relation->getRelated()->newQuery()
                ->whereIn($foreignKey, array_keys($this->userIds))
                ->whereMatchesTalentRequest($this->filters)
                ->whereAuthorizedToView()
                ->pluck($foreignKey)
                ->flip();
        }

        foreach (array_keys($this->userIds) as $userId) {
            $this->results[$userId] = array_values(array_filter(
                array_keys($matchedUserIdsBySource),
                fn (string $sourceName) => $matchedUserIdsBySource[$sourceName]->has($userId),
            ));
        }

        $this->hasResolved = true;
    }
}
