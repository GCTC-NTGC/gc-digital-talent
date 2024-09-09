<?php

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;

class PoolBuilder extends Builder
{
    public function wherePublished(): self
    {
        return $this->where('published_at', '<=', now());
    }

    public function whereNotClosed(): self
    {
        return $this->where('closing_date', '>', now());
    }

    public function whereCurrentlyActive(): self
    {
        return $this->wherePublished()->whereNotClosed();
    }
}
