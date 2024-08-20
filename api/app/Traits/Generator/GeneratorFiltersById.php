<?php

namespace App\Traits\Generator;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

trait GeneratorFiltersById
{
    protected ?array $ids;

    public function setIds(?array $ids)
    {
        $this->ids = $ids;

        return $this;
    }

    protected function applyIdFilter(Builder $query): Builder
    {
        Log::debug($this->ids);
        if (! is_null($this->ids)) {
            $query->whereIn('id', $this->ids);
        }

        return $query;
    }
}
