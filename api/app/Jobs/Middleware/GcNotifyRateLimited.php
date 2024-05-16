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
            config('notify.rate_limiters.api_rate_limit_key'),
            $perMinute = config('notify.rate_limiters.api_rate_limit_calls_per_minute'),
            fn () => $next($job)
        );

        if (! $executed) {
            $job->release(60);
        }
    }
}
