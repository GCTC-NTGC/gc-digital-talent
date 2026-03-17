<?php

namespace App\Http\Resources;

use App\Models\CommunityExperience;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CommunityExperience */
class CommunityExperienceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            '__typename' => 'CommunityExperience',
            'title' => $this->title,
            'organization' => $this->organization,
            'project' => $this->project,
            'startDate' => $this->start_date?->format('Y-m-d'),
            'endDate' => $this->end_date?->format('Y-m-d'),
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills),
        ];
    }
}
