<?php

namespace App\Observers;

use App\Models\PoolCandidateSearchRequest;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\TalentRequestSubmissionConfirmation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class PoolCandidateSearchRequestObserver
{
    /**
     * Handle the PoolCandidateSearchRequest "created" event.
     */
    public function created(PoolCandidateSearchRequest $poolCandidateSearchRequest): void
    {
        $message = new TalentRequestSubmissionConfirmation($poolCandidateSearchRequest->id);

        try {
            Notification::route(GcNotifyEmailChannel::class, [
                'requestor name' => $poolCandidateSearchRequest->full_name,
                'email address' => $poolCandidateSearchRequest->email,
            ])->notify($message);
        } catch (Throwable $e) {
            // best-effort: log error and continue
            Log::error('Couldn\'t send request confirmation: '.$e->getMessage());
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
