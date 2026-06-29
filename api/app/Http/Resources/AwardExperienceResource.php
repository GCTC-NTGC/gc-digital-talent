<?php

namespace App\Http\Resources;

use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Models\AwardExperience;
use App\Traits\HasLocalizedEnums;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin AwardExperience */
class AwardExperienceResource extends JsonResource
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
