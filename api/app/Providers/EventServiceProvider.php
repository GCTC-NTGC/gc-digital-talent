<?php

namespace App\Providers;

use App\Events\AssessmentResultSaved;
use App\Events\TalentNominationSubmitted;
use App\Events\UserFileGenerated;
use App\Events\WorkExperienceSaved;
use App\Listeners\ComputeCandidateAssessmentStatus;
use App\Listeners\ComputeGovEmployeeProfileData;
use App\Listeners\SendFileGeneratedNotification;
use App\Listeners\SendTalentNominationSubmittedNotifications;
use BeyondCode\ServerTiming\Facades\ServerTiming;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

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
        // server timing events - set SERVER_TIMING_ENABLED to true to view in your browser
        Event::listen(function (\Nuwave\Lighthouse\Events\StartRequest $event) {
            ServerTiming::start('Lighthouse Request');
        });
        Event::listen(function (\Nuwave\Lighthouse\Events\EndRequest $event) {
            ServerTiming::stop('Lighthouse Request');
        });
        Event::listen(function (\Nuwave\Lighthouse\Events\StartOperationOrOperations $event) {
            ServerTiming::start('Lighthouse Operations');
        });
        Event::listen(function (\Nuwave\Lighthouse\Events\EndOperationOrOperations $event) {
            ServerTiming::stop('Lighthouse Operations');
        });
        Event::listen(function (\Nuwave\Lighthouse\Events\StartExecution $event) {
            ServerTiming::start('Lighthouse Execution');
        });
        Event::listen(function (\Nuwave\Lighthouse\Events\EndExecution $event) {
            ServerTiming::stop('Lighthouse Execution');
        });
        DB::listen(function ($query) {
            // cumulative - there could be several queries in a request
            $before = ServerTiming::getDuration('Database Query') ?? 0;
            ServerTiming::setDuration('Database Query', $before + $query->time);

        });
    }
}
