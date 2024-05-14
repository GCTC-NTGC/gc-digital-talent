<?php

namespace App\Observers;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use App\Notifications\ApplicationStatusChanged;

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
        if (config('feature.notifications')) {
            if (
                // new status is a final
                in_array($newStatus, PoolCandidateStatus::finalDecisionGroup()) ||
                 // old status was a final
                in_array($oldStatus, PoolCandidateStatus::finalDecisionGroup()) ||
                 // new status is a removed
                in_array($newStatus, PoolCandidateStatus::removedGroup()) ||
                 // old status was a removed
                in_array($oldStatus, PoolCandidateStatus::removedGroup())
            ) {
                $poolCandidate->user->notify(new ApplicationStatusChanged(
                    $poolCandidate->pool->name['en'],
                    $poolCandidate->pool->name['fr'],
                ));
            }
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
