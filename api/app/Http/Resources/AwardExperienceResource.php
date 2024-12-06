<?php

namespace App\Http\Resources;

use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Traits\HasLocalizedEnums;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AwardExperience */
class AwardExperienceResource extends JsonResource
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
        return [
            'id' => $this->id,
            '__typename' => 'AwardExperience',
            'title' => $this->title,
            'issuedBy' => $this->issued_by,
            'awardedDate' => $this->awarded_date?->format('Y-m-d'),
            'awardedTo' => $this->localizeEnum($this->awarded_to, AwardedTo::class),
            'awardedScope' => $this->localizeEnum($this->awarded_scope, AwardedScope::class),
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills),
        ];
    }
}
