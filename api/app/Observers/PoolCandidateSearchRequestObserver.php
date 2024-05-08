<?php

namespace App\Observers;

use App\Models\PoolCandidateSearchRequest;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\TalentRequestSubmissionConfirmation;
use Illuminate\Support\Facades\Notification;

class PoolCandidateSearchRequestObserver
{
    /**
     * Handle the PoolCandidateSearchRequest "created" event.
     */
    public function created(PoolCandidateSearchRequest $poolCandidateSearchRequest): void
    {
        if (config('feature.notifications')) {
            $message = new TalentRequestSubmissionConfirmation($poolCandidateSearchRequest->id);

            Notification::route(GcNotifyEmailChannel::class, [
                'requestor name' => $poolCandidateSearchRequest->full_name,
                'email address' => $poolCandidateSearchRequest->email,
            ])->notify($message);
        }
    }

    /**
     * Handle the PoolCandidateSearchRequest "updated" event.
     */
    public function updated(PoolCandidateSearchRequest $poolCandidateSearchRequest): void
    {
        //
    }

    /**
     * Handle the PoolCandidateSearchRequest "deleted" event.
     */
    public function deleted(PoolCandidateSearchRequest $poolCandidateSearchRequest): void
    {
        //
    }

    /**
     * Handle the PoolCandidateSearchRequest "restored" event.
     */
    public function restored(PoolCandidateSearchRequest $poolCandidateSearchRequest): void
    {
        //
    }

    /**
     * Handle the PoolCandidateSearchRequest "force deleted" event.
     */
    public function forceDeleted(PoolCandidateSearchRequest $poolCandidateSearchRequest): void
    {
        //
    }
}
