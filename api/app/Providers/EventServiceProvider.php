<?php

namespace App\Providers;

use App\Events\AssessmentResultSaved;
use App\Events\CandidateStatusChanged;
use App\Events\TalentNominationSubmitted;
use App\Events\UserFileGenerated;
use App\Events\WorkExperienceSaved;
use App\Listeners\ComputeCandidateAssessmentStatus;
use App\Listeners\ComputeCandidateFinalDecision;
use App\Listeners\ComputeGovEmployeeProfileData;
use App\Listeners\SendFileGeneratedNotification;
use App\Listeners\SendTalentNominationSubmittedNotifications;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        AssessmentResultSaved::class => [
            ComputeCandidateAssessmentStatus::class,
        ],
        CandidateStatusChanged::class => [
            ComputeCandidateFinalDecision::class,
        ],
        UserFileGenerated::class => [
            SendFileGeneratedNotification::class,
        ],
        WorkExperienceSaved::class => [
            ComputeGovEmployeeProfileData::class,
        ],
        TalentNominationSubmitted::class => [
            SendTalentNominationSubmittedNotifications::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
