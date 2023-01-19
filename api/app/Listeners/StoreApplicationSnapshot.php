<?php

namespace App\Listeners;

use App\Events\ApplicationSubmitted;
use App\GraphQL\Util\GraphQLClient;
use App\Models\User;
use App\Models\Pool;
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
            'awardExperiences',
            'awardExperiences.skills',
            'communityExperiences',
            'communityExperiences.skills',
            'educationExperiences',
            'educationExperiences.skills',
            'personalExperiences',
            'personalExperiences.skills',
            'workExperiences',
            'workExperiences.skills'
        ])->findOrFail($poolCandidate->user_id);

        // collect skills attached to the Pool to pass into resource collection
        $pool = Pool::with([
            'essentialSkills',
            'nonessentialSkills'
        ])->findOrFail($poolCandidate->pool_id);
        $essentialSkillIds = $pool->essentialSkills()->pluck('id')->toArray();
        $nonessentialSkillIds = $pool->nonessentialSkills()->pluck('id')->toArray();
        $poolSkillIds = array_merge($essentialSkillIds, $nonessentialSkillIds);

        $profile = new UserResource($user);
        $profile = $profile->poolSkillIds($poolSkillIds);

        $poolCandidate->profile_snapshot = $profile;
        $poolCandidate->save();
    }
}
