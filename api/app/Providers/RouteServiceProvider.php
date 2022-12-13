<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::middleware(['web', 'throttle:web'])
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(config('app.rate_limit'))->by(optional($request->user())->id ?: $request->ip())->response(function () {
                return response([
                    'message' => 'Rate Limit Reached for API'
                ], 429);
            });
        });
        RateLimiter::for('web', function (Request $request) {
            return Limit::perMinute(config('app.rate_limit'))->by(optional($request->user())->id ?: $request->ip())->response(function () {
                return response([
                    'message' => 'Rate Limit Reached for Web'
                ], 429);
            });
        });
        // This limiter is for the throttle directive which can be set independently of the route-based limiters and can raise graphql-style error messages.
        RateLimiter::for('graphql', function (Request $request) {
            return Limit::perMinute(config('app.rate_limit'))->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
