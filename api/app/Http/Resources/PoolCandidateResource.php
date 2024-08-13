<?php

namespace App\Http\Resources;

use App\Enums\EducationRequirementOption;
use App\Enums\PoolCandidateStatus;
use App\Traits\HasLocalizedEnums;
use Illuminate\Http\Resources\Json\JsonResource;

class PoolCandidateResource extends JsonResource
{
    use HasLocalizedEnums;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $awardExperiences = AwardExperienceResource::collection($this->educationRequirementAwardExperiences);
        $communityExperiences = CommunityExperienceResource::collection($this->educationRequirementCommunityExperiences);
        $educationExperiences = EducationExperienceResource::collection($this->educationRequirementEducationExperiences);
        $personalExperiences = PersonalExperienceResource::collection($this->educationRequirementPersonalExperiences);
        $workExperiences = WorkExperienceResource::collection($this->educationRequirementWorkExperiences);

        $collection = collect();
        $collection = $collection->merge($awardExperiences);
        $collection = $collection->merge($communityExperiences);
        $collection = $collection->merge($educationExperiences);
        $collection = $collection->merge($personalExperiences);
        $collection = $collection->merge($workExperiences);

        return [
            'id' => $this->id,
            'status' => $this->localizeEnum($this->pool_candidate_status, PoolCandidateStatus::class),
            'expiryDate' => date('Y-m-d', strtotime($this->expiry_date)),
            'pool' => (new PoolResource($this->pool)),
            'educationRequirementOption' => $this->localizeEnum($this->education_requirement_option, EducationRequirementOption::class),
            'educationRequirementExperiences' => $collection,
            'signature' => $this->signature,
            'screeningQuestionResponses' => ScreeningQuestionResponseResource::collection($this->screeningQuestionResponses),
            'generalQuestionResponses' => GeneralQuestionResponseResource::collection($this->generalQuestionResponses),
            'archivedAt' => $this->archived_at,
            'submittedAt' => $this->submitted_at,
            'suspendedAt' => $this->suspended_at,
        ];
    }
}
