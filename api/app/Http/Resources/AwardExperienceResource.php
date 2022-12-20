<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AwardExperienceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // having $poolSkillIds passed in
        // $skills = SkillResource::collection($this->skills)
        // $skillsFiltered = $skills->whereIn('id', $poolSkillIds)
        return [
            'id' => $this->id,
            '__typename' => 'AwardExperience',
            'title' => $this->title,
            'issuedBy' => $this->issued_by,
            'awardedDate' => $this->awarded_date,
            'awardedTo' => $this->awarded_to,
            'awardedScope' => $this->awarded_scope,
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills)
            // 'skills' => $skillsFiltered
        ];
    }
}
