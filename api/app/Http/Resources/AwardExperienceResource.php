<?php

namespace App\Http\Resources;

use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
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

        $relatedExperienceResource = (bool) $this->relatedExperience ? match (get_class($this->relatedExperience)) {
            WorkExperience::class => new WorkExperienceResource($this->relatedExperience),
            EducationExperience::class => new EducationExperienceResource($this->relatedExperience),
            CommunityExperience::class => new CommunityExperienceResource($this->relatedExperience),
            PersonalExperience::class => new PersonalExperienceResource($this->relatedExperience),
            // Another award shouldn't be possible here but just in case we change it at some point
            AwardExperience::class => new AwardExperienceResource($this->relatedExperience),
            default => null
        } : null;

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
            'projectName' => $this->project_name,
            'relatedExperience' => $relatedExperienceResource,
        ];
    }
}
