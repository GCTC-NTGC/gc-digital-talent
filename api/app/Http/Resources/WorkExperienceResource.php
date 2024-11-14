<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\WorkExperience */
class WorkExperienceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            '__typename' => 'WorkExperience',
            'organization' => $this->organization,
            'role' => $this->role,
            'division' => $this->division,
            'startDate' => $this->start_date?->format('Y-m-d'),
            'endDate' => $this->end_date?->format('Y-m-d'),
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills),
            'employmentCategory' => $this->employment_category,
            'extSizeOfOrganization' => $this->ext_size_of_organization,
            'extRoleSeniority' => $this->ext_role_seniority,
            'govEmploymentType' => $this->gov_employment_type,
            'govPositionType' => $this->gov_position_type,
            'govContractStartDate' => $this->gov_contract_start_date?->format('Y-m-d'),
            'govContractEndDate' => $this->gov_contract_end_date?->format('Y-m-d'),
            'govContractorRoleSeniority' => $this->gov_contractor_role_seniority,
            'govContractorType' => $this->gov_contractor_type,
            'cafEmploymentType' => $this->caf_employment_type,
            'cafForce' => $this->caf_force,
            'cafRank' => $this->caf_rank,
            'classification' => $this->classification_id,
            'department' => $this->department_id,
        ];
    }
}
