<?php

namespace App\Http\Resources;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\ProvinceOrTerritory;
use App\Enums\WorkRegion;
use App\Traits\HasLocalizedEnums;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    use HasLocalizedEnums;

    protected $poolSkillIds;

    public int $version;

    public function poolSkillIds($value)
    {
        $this->poolSkillIds = $value;

        return $this;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $poolSkillIds = $this->poolSkillIds; // passed in from StoreApplicationSnapshot, an array of skill ids attached to a pool

        $awardExperiences = AwardExperienceResource::collection($this->awardExperiences);
        $communityExperiences = CommunityExperienceResource::collection($this->communityExperiences);
        $educationExperiences = EducationExperienceResource::collection($this->educationExperiences);
        $personalExperiences = PersonalExperienceResource::collection($this->personalExperiences);
        $workExperiences = WorkExperienceResource::collection($this->workExperiences);

        $collection = collect();
        $collection = $collection->merge($awardExperiences);
        $collection = $collection->merge($communityExperiences);
        $collection = $collection->merge($educationExperiences);
        $collection = $collection->merge($personalExperiences);
        $collection = $collection->merge($workExperiences);

        // if poolSkillIds is valid, filter out skills that are not in the id array by stepping through each item in $collection
        if (! empty($poolSkillIds)) {
            $collection->each(function ($experience) use ($poolSkillIds) {
                $skills = $experience->skills;
                $skillsFiltered = $skills->filter(function ($skill) use ($poolSkillIds) {
                    return in_array($skill->id, $poolSkillIds);
                });
                $experience->skills = $skillsFiltered;
            });
        }

        return [
            'version' => $this->version,
            'id' => $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'isEmailVerified' => $this->isEmailVerified,
            'telephone' => $this->telephone,
            'preferredLang' => $this->localizeEnum($this->preferred_lang, Language::class),
            'preferredLanguageForInterview' => $this->localizeEnum($this->preferred_language_for_interview, Language::class),
            'preferredLanguageForExam' => $this->localizeEnum($this->preferred_language_for_exam, Language::class),
            'currentProvince' => $this->localizeEnum($this->current_province, ProvinceOrTerritory::class),
            'currentCity' => $this->current_city,
            'citizenship' => $this->localizeEnum($this->citizenship, CitizenshipStatus::class),
            'armedForcesStatus' => $this->localizeEnum($this->armed_forces_status, ArmedForcesStatus::class),
            'lookingForEnglish' => $this->looking_for_english,
            'lookingForFrench' => $this->looking_for_french,
            'lookingForBilingual' => $this->looking_for_bilingual,
            'firstOfficialLanguage' => $this->localizeEnum($this->first_official_language, Language::class),
            'secondLanguageExamCompleted' => $this->second_language_exam_completed,
            'secondLanguageExamValidity' => $this->second_language_exam_validity,
            'comprehensionLevel' => $this->localizeEnum($this->comprehension_level, EvaluatedLanguageAbility::class),
            'writtenLevel' => $this->localizeEnum($this->written_level, EvaluatedLanguageAbility::class),
            'verbalLevel' => $this->localizeEnum($this->verbal_level, EvaluatedLanguageAbility::class),
            'estimatedLanguageAbility' => $this->localizeEnum($this->estimated_language_ability, EstimatedLanguageAbility::class),
            'isGovEmployee' => $this->computed_is_gov_employee,
            'workEmail' => $this->work_email,
            'isWorkEmailVerified' => $this->isWorkEmailVerified,
            'hasPriorityEntitlement' => $this->has_priority_entitlement,
            'govEmployeeType' => $this->localizeEnum($this->computed_gov_employee_type, GovEmployeeType::class),
            'govRole' => $this->computed_gov_role,
            'department' => $this->department ? (new DepartmentResource($this->department)) : null,
            'currentClassification' => (new ClassificationResource($this->currentClassification)),
            'govPositionType' => $this->computed_gov_position_type,
            'govEndDate' => $this->computed_gov_end_date,
            'isWoman' => $this->is_woman,
            'hasDisability' => $this->has_disability,
            'isVisibleMinority' => $this->is_visible_minority,
            'indigenousCommunities' => $this->localizeEnumArray($this->indigenous_communities, IndigenousCommunity::class),
            'indigenousDeclarationSignature' => $this->indigenous_declaration_signature,
            'hasDiploma' => $this->has_diploma,
            'locationPreferences' => $this->localizeEnumArray($this->location_preferences, WorkRegion::class),
            'locationExemptions' => $this->location_exemptions,
            'acceptedOperationalRequirements' => $this->localizeEnumArray($this->accepted_operational_requirements, OperationalRequirement::class),
            'positionDuration' => $this->position_duration,
            'experiences' => $collection,
            'priorityNumber' => $this->priority_number,
            'isProfileComplete' => $this->isProfileComplete,
            'userSkills' => UserSkillResource::collection($this->whenLoaded('userSkills')),
        ];
    }
}
