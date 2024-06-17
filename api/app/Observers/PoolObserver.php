<?php

namespace App\Observers;

use App\Models\Pool;
use App\Models\User;
use App\Notifications\NewJobPosted;
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
        $oldPublishedAt = $pool->getOriginal('published_at');
        $newPublishedAt = $pool->published_at;
        if (config('feature.notifications')) {
            if (
                is_null($oldPublishedAt) && ! is_null($newPublishedAt)
            ) {
                $notification = new NewJobPosted(
                    $pool->name['en'],
                    $pool->name['fr'],
                    $pool->id
                );

                User::all()->each(function ($user) use ($notification) {
                    try {
                        $user->notify($notification);
                    } catch (Throwable $e) {
                        // best-effort: log and continue
                        Log::error('Failed to send "new job posted" notification to ['.$user->id.'] '.$e->getMessage());
                    }
                });
            }
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
