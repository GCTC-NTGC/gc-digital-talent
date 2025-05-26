<?php

namespace App\Traits\Generator;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

trait Filterable
{
    protected ?array $filters = null;

    protected ?array $ids = null;

    /** If true, stores applied filters to debugging */
    protected bool $debug = false;

    public array $calledFilters = [];

    public function debug(bool $value)
    {
        $this->debug = $value;

        return $this;
    }

    /**
     * Set the filters to be applied
     *
     * @param  ?array  $filters  The filters being applied
     */
    public function setFilters(?array $filters)
    {
        $this->filters = $filters;

        return $this;
    }

    /**
     * Set the ids to be applied
     *
     * @param  ?array  $ids  The ids being applied
     */
    public function setIds(?array $ids)
    {
        $this->ids = $ids;

        return $this;
    }

    /**
     * Flattens out filters so it can be used
     * to apply the appropriate scopes
     *
     * @return array The flattened filters
     */
    private function flattenFilters($filters): array
    {
        $flattened = [];
        foreach ($filters as $k => $v) {
            // NOTE: Equity is expected to be assoc array so do not flatten it
            if (is_array($v) && Arr::isAssoc($v) && $k !== 'equity') {
                $flattened = array_merge($flattened, $this->flattenFilters($v));
            } else {
                $flattened[$k] = $v;
            }
        }

        return $flattened;
    }

    /**
     * Apply filters to the query builder
     *
     * @param  Builder  $query  The query builder to apply filters to
     * @param  array  $scopeMap  A map of $filterKey => $scopeName
     * @return Builder $query The query builder with scopes applied
     */
    public function applyFilters(Builder &$query, ?array $scopeMap): Builder
    {
        if (is_null($this->filters) && is_null($this->ids)) {
            return $query;
        }

        $filters = $this->flattenFilters($this->filters ?? []);
        foreach ($filters as $key => $value) {
            $scope = $scopeMap[$key] ?? $key;

            if (($query->hasNamedScope($scope) || method_exists($query, $scope)) && $value) {
                if ($this->debug) {
                    $this->calledFilters[] = [
                        'scope' => $scope,
                        'value' => $value,
                    ];
                }
                $query->$scope($value);
            }
        }

        if (! is_null($this->ids)) {
            $query->whereIn('id', $this->ids);
        }

        return $query;
    }
}
