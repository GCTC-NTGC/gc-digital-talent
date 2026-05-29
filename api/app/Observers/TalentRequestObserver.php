<?php

namespace App\Observers;

use App\Models\TalentRequest;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\TalentRequestSubmissionConfirmation;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class TalentRequestObserver
{
    /**
     * Handle the TalentRequest "creating" event.
     */
    public function creating(TalentRequest $talentRequest): void
    {
        $talentRequest->user_id = $talentRequest->user_id ?? Auth::id();
    }

    /**
     * Handle the TalentRequest "created" event.
     */
    public function created(TalentRequest $talentRequest): void
    {
        $message = new TalentRequestSubmissionConfirmation($talentRequest->id);

        try {
            Notification::route(GcNotifyEmailChannel::class, [
                'requestor name' => $talentRequest->full_name,
                'email address' => $talentRequest->email,
            ])->notify($message);
        } catch (Throwable $e) {
            // best-effort: log error and continue
            Log::error('Couldn\'t send request confirmation: '.$e->getMessage());
        }
    }

    /**
     * Handle the TalentRequest "updated" event.
     */
    public function updated(TalentRequest $talentRequest): void
    {
        if ($talentRequest->wasChanged(['status', 'in_progress_details', 'completion_details'])) {
            $talentRequest->timestamps = false;
            $talentRequest->status_changed_at = Carbon::now();
            $talentRequest->saveQuietly();
            $talentRequest->timestamps = true;
        }
    }
}
