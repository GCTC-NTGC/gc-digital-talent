<?php

namespace App\Http\Resources;

use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Models\EducationExperience;
use App\Traits\HasLocalizedEnums;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin EducationExperience */
class EducationExperienceResource extends JsonResource
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
            '__typename' => 'EducationExperience',
            'institution' => $this->institution,
            'areaOfStudy' => $this->area_of_study,
            'thesisTitle' => $this->thesis_title,
            'type' => $this->localizeEnum($this->type, EducationType::class),
            'status' => $this->localizeEnum($this->status, EducationStatus::class),
            'startDate' => $this->start_date?->format('Y-m-d'),
            'endDate' => $this->end_date?->format('Y-m-d'),
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills),
        ];
    }
}
