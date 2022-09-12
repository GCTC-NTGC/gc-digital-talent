<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommunityExperienceResource extends JsonResource
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
            '__typename' => 'CommunityExperience',
            'title' => $this->title,
            'organization' => $this->organization,
            'project' => $this->project,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills)
        ];
    }
}
