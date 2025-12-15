<?php

namespace App\GraphQL\Types\Pool;

class Activities
{
    public function __invoke($root, array $args)
    {
        $query = $root->activities();

        // Hard-coded scopes
        $query->whereIsPoolActivity();
        $query->authorizedToViewPoolActivity();

        // Dynamic scopes from input
        foreach ($args['where'] ?? [] as $scope => $value) {
            if (! is_null($value) && method_exists($query->getModel(), 'scope'.ucfirst($scope))) {
                $query->{$scope}($value);
            }
        }

        $activities = $query->get()->groupBy(fn ($activity) => $activity->created_at->format('Y-m-d'));

        return $activities->map(fn ($items, $day) => [
            'day' => $day,
            'items' => $items,
        ])->values();
    }
}
