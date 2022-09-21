<?php

namespace App\Listeners;

use App\Events\ApplicationSubmitted;
use App\GraphQL\Util\GraphQLClient;
use App\Models\User;
use App\Http\Resources\UserResource;

class StoreApplicationSnapshot
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\ApplicationSubmitted  $event
     * @return void
     */
    public function handle(ApplicationSubmitted $event)
    {
        $poolCandidate = $event->poolCandidate;
        $user = User::with([
            'department',
            'currentClassification',
            'expectedClassifications',
            'expectedGenericJobTitles',
            'cmoAssets',
            'awardExperiences',
            'communityExperiences',
            'educationExperiences',
            'personalExperiences',
            'workExperiences'
        ])->findOrFail($poolCandidate->user_id);
        $profile = new UserResource($user);

        $poolCandidate->profile_snapshot = $profile;
        $poolCandidate->save();
    }
}
