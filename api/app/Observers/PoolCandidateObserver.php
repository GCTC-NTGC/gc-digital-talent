<?php

namespace App\Observers;

use App\Models\PoolCandidate;
use App\Notifications\PoolCandidateStatusChanged;

class PoolCandidateObserver
{
    /**
     * Handle the PoolCandidate "created" event.
     */
    public function created(PoolCandidate $poolCandidate): void
    {
        //
    }

    /**
     * Handle the PoolCandidate "updated" event.
     */
    public function updated(PoolCandidate $poolCandidate): void
    {
        $oldStatus = $poolCandidate->getOriginal('pool_candidate_status');
        $newStatus = $poolCandidate->pool_candidate_status;
        if (config('feature.status_notifications') && $oldStatus != $newStatus) {
            $poolCandidate->user->notify(new PoolCandidateStatusChanged($oldStatus, $newStatus, $poolCandidate->id, $poolCandidate->pool->name));
        }
    }

    /**
     * Handle the PoolCandidate "deleted" event.
     */
    public function deleted(PoolCandidate $poolCandidate): void
    {
        //
    }

    /**
     * Handle the PoolCandidate "restored" event.
     */
    public function restored(PoolCandidate $poolCandidate): void
    {
        //
    }

    /**
     * Handle the PoolCandidate "force deleted" event.
     */
    public function forceDeleted(PoolCandidate $poolCandidate): void
    {
        //
    }
}
