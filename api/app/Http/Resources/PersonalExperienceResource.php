<?php

namespace App\Http\Resources;

use App\Models\PersonalExperience;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PersonalExperience */
class PersonalExperienceResource extends JsonResource
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
            '__typename' => 'PersonalExperience',
            'title' => $this->title,
            'startDate' => $this->start_date?->format('Y-m-d'),
            'endDate' => $this->end_date?->format('Y-m-d'),
            'skills' => SkillResource::collection($this->skills),
            'learningDescription' => $this->learning_description,
            'organization' => $this->organization,
        ];
    }
}
