<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    public function boot()
    {
        Relation::enforceMorphMap([
            'awardExperience' => \App\Models\AwardExperience::class,
            'communityExperience' => '\App\Models\CommunityExperience',
        ]);
    }
}
