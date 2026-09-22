<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

trait AppliesNominationType
{
    /**
     * A fresh query on $relation's related model, scoped to $nominationType if given.
     *
     * getRelated()->newQuery() rebuilds a fresh query from the related model, so
     * forNominationType() baked into the matching*Sources() relation itself is lost here — it
     * has to be re-applied to this actual query.
     */
    private function freshNominationTypeQuery(Relation $relation, ?string $nominationType): Builder
    {
        $query = $relation->getRelated()->newQuery();

        if ($nominationType) {
            $query->forNominationType($nominationType); // @phpstan-ignore method.notFound
        }

        return $query;
    }
}
