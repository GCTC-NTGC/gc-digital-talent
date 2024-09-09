<?php

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;

class PoolBuilder extends Builder
{
    public function wherePublished(): self
    {
        return $this->where('published_at', '<=', now());
    }
}
