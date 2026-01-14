<?php

namespace App\Observers;

use App\Enums\PoolStatus;
use App\Models\Pool;
use App\Notifications\ApplicationDeadlineExtended;
use Illuminate\Support\Facades\Log;
use Throwable;

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
        // Notify users with a draft application when published pool's closing date is extended
        $oldClosingDate = $pool->getOriginal('closing_date');
        $newClosingDate = $pool->closing_date;

        // Check if published pool's new closing date is greater than old date
        if (
            $pool->status === PoolStatus::PUBLISHED->name
            && ! is_null($oldClosingDate)
            && ! is_null($newClosingDate)
            && $newClosingDate->gte($oldClosingDate)
        ) {

            $pool->poolCandidates()
                ->where('application_status', 'DRAFT') // Only send notification to draft applications
                ->where(function ($query) {
                    $query->whereDate('expiry_date', '>=', date('Y-m-d'))
                        ->orWhereNull('expiry_date');
                })
                ->each(function ($poolCandidate) use ($newClosingDate) {
                    $poolCandidate->load('user', 'pool');

                    $notification = new ApplicationDeadlineExtended(
                        $poolCandidate->user->getFullName(),
                        $newClosingDate,
                        $poolCandidate->pool->name['en'],
                        $poolCandidate->pool->name['fr'],
                        $poolCandidate->id,
                    );

                    try {
                        $poolCandidate->user->notify($notification);
                    } catch (Throwable $e) {
                        // best-effort: log and continue
                        Log::error('Failed to send "job closing date extended" notification to ['.$poolCandidate->user->id.']');
                    }
                });
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
