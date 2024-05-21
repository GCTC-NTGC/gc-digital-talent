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
        return [
            'id' => $this->id,
            '__typename' => 'AwardExperience',
            'title' => $this->title,
            'issuedBy' => $this->issued_by,
            'awardedDate' => $this->awarded_date?->format('Y-m-d'),
            'awardedTo' => $this->awarded_to,
            'awardedScope' => $this->awarded_scope,
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills),
            'user' => new UserStubResource($this->user),
        ];
    }
}
