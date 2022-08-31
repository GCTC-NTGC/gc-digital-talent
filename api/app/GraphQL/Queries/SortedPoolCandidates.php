<?php

namespace App\GraphQL\Queries;
use App\Models\PoolCandidate;
use Database\Helpers\ApiEnums;

final class SortedPoolCandidates
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $allCandidates = PoolCandidate::all();

        $order = ApiEnums::priorityDerivedStatuses();

        // https://stackoverflow.com/questions/31983216/custom-sorting-on-a-laravel-relationship-collection
        $allCandidates = $allCandidates->sort(function ($a, $b) use ($order) {
            $pos_a = array_search($a->user->getPriorityDerivedAttribute(), $order);
            $pos_b = array_search($b->user->getPriorityDerivedAttribute(), $order);
            return $pos_a - $pos_b;
          });

        return $allCandidates;
    }
}
