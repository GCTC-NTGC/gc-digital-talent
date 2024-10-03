<?php

namespace App\Observers;

use App\Enums\PoolCandidateStatus;
use App\Events\CandidateStatusChanged;
use App\Models\PoolCandidate;
use App\Notifications\ApplicationStatusChanged;
use Illuminate\Support\Facades\Log;
use Throwable;

class PoolCandidateObserver
{
    /**
     * Handle the PoolCandidate "created" event.
     */
    public function created(PoolCandidate $poolCandidate): void
    {
        CandidateStatusChanged::dispatchIf(isset($poolCandidate->pool_candidate_status), $poolCandidate);
    }

    /**
     * Handle the PoolCandidate "updated" event.
     */
    public function updated(PoolCandidate $poolCandidate): void
    {
        $oldStatus = $poolCandidate->getOriginal('pool_candidate_status');
        $newStatus = $poolCandidate->pool_candidate_status;

        CandidateStatusChanged::dispatchIf($poolCandidate->wasChanged('pool_candidate_status'), $poolCandidate);

        if (
            ($oldStatus != $newStatus) &&
            (
                // new status is a final
                in_array($newStatus, PoolCandidateStatus::finalDecisionGroup()) ||
                    // old status was a final
                in_array($oldStatus, PoolCandidateStatus::finalDecisionGroup()) ||
                    // new status is a removed
                in_array($newStatus, PoolCandidateStatus::removedGroup()) ||
                    // old status was a removed
                in_array($oldStatus, PoolCandidateStatus::removedGroup())
            )) {
            try {

                $poolCandidate->user->notify(new ApplicationStatusChanged(
                    $poolCandidate->pool->name['en'],
                    $poolCandidate->pool->name['fr'],
                ));
            } catch (Throwable $e) {
                // best-effort: log and continue
                Log::error('Failed to send "application status changed" notification to ['.$poolCandidate->id.'] '.$e->getMessage());
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
