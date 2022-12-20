<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Database\Eloquent\Collection;

use App\Models\Department;
use GraphQL\Experimental\Executor\Collector;

class UserResource extends JsonResource
{
    protected $poolSkillIds;

    public function poolSkillIds($value){
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

        // pass $this->poolSkillIds into the collection instances
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

        return [
            'id' => $this->id,
            'sub' => $this->sub,
            'roles' => $this->roles,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'preferredLang' => $this->preferred_lang ? strtoupper($this->preferred_lang) : null,
            'currentProvince' => $this->current_province,
            'currentCity' => $this->current_city,
            'citizenship' => $this->citizenship,
            'armedForcesStatus' => $this->armed_forces_status,
            'languageAbility' => $this->language_ability,
            'lookingForEnglish' => $this->looking_for_english,
            'lookingForFrench' => $this->looking_for_french,
            'lookingForBilingual' => $this->looking_for_bilingual,
            'bilingualEvaluation' => $this->bilingual_evaluation,
            'comprehensionLevel' => $this->comprehension_level,
            'writtenLevel' => $this->written_level,
            'verbalLevel' => $this->verbal_level,
            'estimatedLanguageAbility' => $this->estimated_language_ability,
            'isGovEmployee' => $this->is_gov_employee,
            'hasPriorityEntitlement' => $this->has_priority_entitlement,
            'govEmployeeType' => $this->gov_employee_type,
            'department' => $this->department ? (new DepartmentResource(Department::find($this->department))) : null,
            'currentClassification' => (new ClassificationResource($this->currentClassification)),
            'expectedClassifications' => ClassificationResource::collection($this->expectedClassifications),
            'expectedGenericJobTitles' => GenericJobTitleResource::collection($this->expectedGenericJobTitles),
            'isWoman' => $this->is_woman,
            'hasDisability' => $this->has_disability,
            'isIndigenous' => $this->is_indigenous,
            'isVisibleMinority' => $this->is_visible_minority,
            'indigenousCommunities' => $this->indigenous_communities,
            'indigenousDeclarationSignature' => $this->indigenous_declaration_signature,
            'jobLookingStatus' => $this->job_looking_status,
            'hasDiploma' => $this->has_diploma,
            'locationPreferences' => $this->location_preferences,
            'locationExemptions' =>  $this->location_exemptions,
            'acceptedOperationalRequirements' => $this->accepted_operational_requirements,
            'expectedSalary' => $this->expected_salary,
            'positionDuration' => $this->position_duration,
            'cmoAssets' => CmoAssetResource::collection($this->cmoAssets),
            'poolCandidates' => PoolCandidateResource::collection($this->poolCandidates),
            'experiences' => $collection,
            'priorityNumber' => $this->priority_number,
            'isProfileComplete' => $this->isProfileComplete,
        ];
    }
}
