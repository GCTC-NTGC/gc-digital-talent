<?php

namespace App\Jobs\Middleware;

use Closure;
use Illuminate\Support\Facades\RateLimiter;

class GcNotifyRateLimited
{
    /**
     * Process the queued job.
     *
     * @param  \Closure(object): void  $next
     */
    public function handle(object $job, Closure $next): void
    {
        $executed = RateLimiter::attempt(
            'gcnotify_api',
            $perMinute = config('notify.client.max_requests_per_minute'),
            fn () => $next($job)
        );

        if (! $executed) {
            $job->release(60); // try again in 60 seconds
        }
    }
}
