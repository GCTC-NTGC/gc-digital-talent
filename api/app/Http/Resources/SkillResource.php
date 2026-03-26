<?php

namespace App\Http\Resources;

use App\Enums\SkillCategory;
use App\Models\UserSkill;
use App\Traits\HasLocalizedEnums;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserSkill
 */
class SkillResource extends JsonResource
{
    use HasLocalizedEnums;

    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $array = [
            'id' => $this->id,
            'key' => $this->key,
            'name' => $this->name,
            'category' => $this->localizeEnum($this->category, SkillCategory::class),
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
