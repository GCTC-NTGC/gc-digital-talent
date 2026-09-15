<?php

namespace App\Http\Resources;

use App\Enums\DegreeType;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\FellowshipType;
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
            'educationType' => $this->localizeEnum($this->education_type, EducationType::class),
            'status' => $this->localizeEnum($this->status, EducationStatus::class),
            'startDate' => $this->start_date?->format('Y-m-d'),
            'endDate' => $this->end_date?->format('Y-m-d'),
            'details' => $this->details,
            'skills' => SkillResource::collection($this->skills),
            'otherEducationType' => $this->other_education_type,
            'degreeType' => $this->localizeEnum($this->degree_type, DegreeType::class),
            'licenseOrAccreditation' => $this->license_or_accreditation,
            'certification' => $this->certification,
            'courseName' => $this->course_name,
            'fellowshipType' => $this->localizeEnum($this->fellowship_type, FellowshipType::class),
            'otherFellowshipType' => $this->other_fellowship_type,
            'prospectiveEndDate' => $this->prospective_end_date?->format('Y-m-d'),
        ];
    }
}
