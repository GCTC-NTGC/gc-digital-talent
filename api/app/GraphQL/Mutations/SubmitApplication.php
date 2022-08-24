<?php

namespace App\GraphQL\Mutations;
use App\Models\PoolCandidate;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use App\GraphQL\Validators\Mutation\SubmitApplicationValidator;
use Database\Helpers\ApiEnums;

final class SubmitApplication
{
    /**
     * Submit an application
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application
        // submit to validator the PoolCandidate model
        $application = PoolCandidate::find($args['applicationId']);
        $submitValidator = new SubmitApplicationValidator;
        $validator = Validator::make($application->toArray(), $submitValidator->rules(), $submitValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        // grab the user that the application belongs to
        // then get the completeness method off the user model and do a throw validation
        $user = $application->user;
        $isUserComplete = $user->getIsProfileCompleteAttribute();
        if (!$isUserComplete) {
            throw ValidationException::withMessages(['profile is not complete']);
        }

        // grab the pool the application belongs to and then grab the essential skills off the pool in the form of an array of Ids
        $pool = $application->pool;
        $poolEssentialSkills = $pool->essentialSkills()->get()->pluck('id')->toArray();

        // grab the AWARD experiences attached to the user, formed into an array of ids, then form an array of skills that are attached to them
        $candidateExperiencesAward = $user->awardExperiences()->pluck('id')->toArray();
        $candidateExperiencesAwardSkills = [];
        foreach ($candidateExperiencesAward as $experienceInstance) {
            $experienceAward = AwardExperience::find($experienceInstance);
            $skillsAward = $experienceAward->skills()->pluck('skills.id')->toArray();
            $candidateExperiencesAwardSkills = array_merge($skillsAward, $candidateExperiencesAwardSkills);
        };

        // grab the COMMUNITY experiences attached to the user, repeat above
        $candidateExperiencesCommunity = $user->communityExperiences()->pluck('id')->toArray();
        $candidateExperiencesCommunitySkills = [];
        foreach ($candidateExperiencesCommunity as $experienceInstance) {
            $experienceCommunity = CommunityExperience::find($experienceInstance);
            $skillsCommunity = $experienceCommunity->skills()->pluck('skills.id')->toArray();
            $candidateExperiencesCommunitySkills = array_merge($skillsCommunity, $candidateExperiencesCommunitySkills);
        };

        // grab the EDUCATION experiences attached to the user, repeat above
        $candidateExperiencesEducation = $user->educationExperiences()->pluck('id')->toArray();
        $candidateExperiencesEducationSkills = [];
        foreach ($candidateExperiencesEducation as $experienceInstance) {
            $experienceEducation = EducationExperience::find($experienceInstance);
            $skillsEducation = $experienceEducation->skills()->pluck('skills.id')->toArray();
            $candidateExperiencesEducationSkills = array_merge($skillsEducation, $candidateExperiencesEducationSkills);
        };

        // grab the PERSONAL experiences attached to the user, repeat above
        $candidateExperiencesPersonal = $user->personalExperiences()->pluck('id')->toArray();
        $candidateExperiencesPersonalSkills = [];
        foreach ($candidateExperiencesPersonal as $experienceInstance) {
            $experiencePersonal = PersonalExperience::find($experienceInstance);
            $skillsPersonal = $experiencePersonal->skills()->pluck('skills.id')->toArray();
            $candidateExperiencesPersonalSkills = array_merge($skillsPersonal, $candidateExperiencesPersonalSkills);
        };

        // grab the WORK experiences attached to the user, repeat above
        $candidateExperiencesWork = $user->workExperiences()->pluck('id')->toArray();
        $candidateExperiencesWorkSkills = [];
        foreach ($candidateExperiencesWork as $experienceInstance) {
            $experienceWork = WorkExperience::find($experienceInstance);
            $skillsWork = $experienceWork->skills()->pluck('skills.id')->toArray();
            $candidateExperiencesWorkSkills = array_merge($skillsWork, $candidateExperiencesWorkSkills);
        };

        // merge and form array of all skills the candidate possesses
        $candidateAllSkills = array_merge($candidateExperiencesAwardSkills, $candidateExperiencesCommunitySkills, $candidateExperiencesEducationSkills, $candidateExperiencesPersonalSkills, $candidateExperiencesWorkSkills);

        // check that every essential skill is in the combined skills array, throw exception if one is not found
        foreach ($poolEssentialSkills as $skillId) {
            $isSkillInApplication = in_array($skillId, $candidateAllSkills);
            if (!$isSkillInApplication){
                throw ValidationException::withMessages(['a required pool skill is missing from application']);
            }
        }

        // grab signature out of argument then validate signature field is non-null and not-empty
        $signature = $args['signature'];
        if ($signature == null || strlen($signature) == 0) {
            throw ValidationException::withMessages(['signature field must be filled']);
        }

        // all validation has successfully completed above, execute the core function of this resolver
        // TODO - decide on a default expiry date, placeholder of year past submission
        // add signature and submission, as well as update the set expiry date and status, update([]) not used due to not working correctly
        $dateNow = Carbon::now();
        $expiryDate = Carbon::now()->addYear();
        $application->submitted_at = $dateNow;
        $application->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION;
        $application->expiry_date = $expiryDate;
        $application->signature = $signature;
        $application->save();

        return $application;
    }
}
