<?php

namespace App\Observers;

use App\Enums\ApplicationStatus;
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
        CandidateStatusChanged::dispatchIf(isset($poolCandidate->application_status), $poolCandidate);
    }

    /**
     * Handle the PoolCandidate "updated" event.
     */
    public function updated(PoolCandidate $poolCandidate): void
    {
        $oldStatus = $poolCandidate->getOriginal('application_status');
        $newStatus = $poolCandidate->application_status;

        CandidateStatusChanged::dispatchIf($poolCandidate->wasChanged('application_status'), $poolCandidate);

        if (
            ($oldStatus != $newStatus) &&
            (
                // new status is a final
                in_array($newStatus, ApplicationStatus::assessedGroup()) ||
                // old status was a final
                in_array($oldStatus, ApplicationStatus::assessedGroup()) ||
                // new status is a removed
                $newStatus === ApplicationStatus::REMOVED->name ||
                // old status was a removed
                $oldStatus === ApplicationStatus::REMOVED->name
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
