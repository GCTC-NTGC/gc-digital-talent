<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

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
        // https://laravel.com/docs/9.x/eloquent#configuring-eloquent-strictness
        Model::shouldBeStrict(! $this->app->isProduction());

        Relation::morphMap([
            'awardExperience' => \App\Models\AwardExperience::class,
            'communityExperience' => \App\Models\CommunityExperience::class,
            'educationExperience' => \App\Models\EducationExperience::class,
            'personalExperience' => \App\Models\PersonalExperience::class,
            'workExperience' => \App\Models\WorkExperience::class,
            'poolsSkills' => \App\Models\Pool::class,
        ]);
        // enable below for database debugging
        // DB::listen(function ($query) {
        //     Log::info(
        //         $query->sql,
        //         $query->bindings,
        //         $query->time
        //     );
        // });
    }
}
