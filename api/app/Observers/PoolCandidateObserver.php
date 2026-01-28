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
        $placementChanged = $poolCandidate->wasChanged('placement_type');

        CandidateStatusChanged::dispatchIf($poolCandidate->wasChanged('application_status'), $poolCandidate);

        if ($this->shouldNotifyUser($oldStatus, $newStatus, $placementChanged)) {
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
     * Determine if the user should be notified of the status/placement change.
     */
    private function shouldNotifyUser($oldStatus, $newStatus, $placementChanged): bool
    {

        $triggerGroup = ApplicationStatus::statusChangedNotificationGroup();

        // Placement changed? Always notify
        if ($placementChanged) {
            return true;
        }

        // Otherwise, notify if status has changed AND is in the trigger group
        return
            $oldStatus !== $newStatus &&
            (in_array($oldStatus, $triggerGroup) || in_array($newStatus, $triggerGroup));
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
