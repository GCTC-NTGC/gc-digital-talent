<?php

namespace App\Observers;

use App\Events\PoolPublised;
use App\Models\Pool;

class PoolObserver
{
    /**
     * Handle the Pool "created" event.
     */
    public function created(Pool $pool): void
    {
        //
    }

    /**
     * Handle the Pool "updated" event.
     */
    public function updated(Pool $pool): void
    {
        $oldPublishedAt = $pool->getOriginal('published_at');
        $newPublishedAt = $pool->published_at;
        if (
            is_null($oldPublishedAt) && ! is_null($newPublishedAt)
        ) {
            PoolPublised::dispatch($pool);
        }
    }

    /**
     * Handle the Pool "deleted" event.
     */
    public function deleted(Pool $pool): void
    {
        //
    }

    /**
     * Handle the Pool "restored" event.
     */
    public function restored(Pool $pool): void
    {
        //
    }

    /**
     * Handle the Pool "force deleted" event.
     */
    public function forceDeleted(Pool $pool): void
    {
        //
    }
}
