<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\OpenIdConfigurationService;
use App\Services\OpenIdBearerTokenService;
use DateTimeZone;
use Lcobucci\Clock\Clock;
use Lcobucci\Clock\SystemClock;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->instance(Clock::class, new SystemClock(new DateTimeZone(config('app.timezone'))));

        $this->app->when(OpenIdConfigurationService::class)
            ->needs('$configUri')
            ->giveConfig('oauth.config_endpoint');

        $this->app->when(OpenIdBearerTokenService::class)
            ->needs('$allowableClockSkew')
            ->giveConfig('oauth.allowable_clock_skew');
    }

    public function boot()
    {
        Relation::enforceMorphMap([
            'awardExperience' => \App\Models\AwardExperience::class,
            'communityExperience' => \App\Models\CommunityExperience::class,
            'educationExperience' => \App\Models\EducationExperience::class,
            'personalExperience' => \App\Models\PersonalExperience::class,
            'workExperience' => \App\Models\WorkExperience::class,
        ]);
        // enable below for database debugging
        // DB::listen(function($query) {
        //     Log::info(
        //         $query->sql,
        //         $query->bindings,
        //         $query->time
        //     );
        // });
    }
}
