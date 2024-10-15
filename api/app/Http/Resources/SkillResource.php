<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\UserSkill
 */
class SkillResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $array = [
            'id' => $this->id,
            'key' => $this->key,
            'name' => $this->name,
            'description' => $this->description,
            'keywords' => $this->keywords,
        ];
        if ($this->relationLoaded('experience_skill')) {
            // Match how we access it through the API
            $array['experienceSkillRecord'] = [
                'details' => $this->experience_skill->details,
            ];
        }

        return $array;
    }
}
