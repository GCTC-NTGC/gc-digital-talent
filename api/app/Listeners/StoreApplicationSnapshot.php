<?php

namespace App\Listeners;

use App\Events\ApplicationSubmitted;
use App\Http\Resources\UserResource;
use App\Models\Pool;
use App\Models\User;

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
     * @return void
     */
    public function handle(ApplicationSubmitted $event)
    {
        $poolCandidate = $event->poolCandidate;
        $user = User::with([
            'department',
            'currentClassification',
            'userSkills.skill',
            'awardExperiences',
            'awardExperiences.skills',
            'communityExperiences',
            'communityExperiences.skills',
            'educationExperiences',
            'educationExperiences.skills',
            'personalExperiences',
            'personalExperiences.skills',
            'workExperiences',
            'workExperiences.skills',
            'poolCandidates',
            'poolCandidates.pool',
            'poolCandidates.pool.classifications',
            'poolCandidates.educationRequirementAwardExperiences.skills',
            'poolCandidates.educationRequirementCommunityExperiences.skills',
            'poolCandidates.educationRequirementEducationExperiences.skills',
            'poolCandidates.educationRequirementPersonalExperiences.skills',
            'poolCandidates.educationRequirementWorkExperiences.skills',
            'poolCandidates.screeningQuestionResponses',
            'poolCandidates.screeningQuestionResponses.screeningQuestion',
        ])->findOrFail($poolCandidate->user_id);

        // collect skills attached to the Pool to pass into resource collection
        $pool = Pool::with([
            'essentialSkills',
            'nonessentialSkills',
        ])->findOrFail($poolCandidate->pool_id);
        $essentialSkillIds = $pool->essentialSkills()->pluck('id')->toArray();
        $nonessentialSkillIds = $pool->nonessentialSkills()->pluck('id')->toArray();
        $poolSkillIds = array_merge($essentialSkillIds, $nonessentialSkillIds);

        // filter out any non-applicable PoolCandidate models attached to User
        $poolCandidateCollection = $user->poolCandidates;
        $filteredPoolCandidateCollection = $poolCandidateCollection->filter(function ($individualPoolCandidate) use ($poolCandidate) {
            return $individualPoolCandidate->id === $poolCandidate->id;
        });
        $user->poolCandidates = $filteredPoolCandidateCollection;

        $profile = new UserResource($user);
        $profile = $profile->poolSkillIds($poolSkillIds);

        $poolCandidate->profile_snapshot = $profile;
        $poolCandidate->save();
    }
}
