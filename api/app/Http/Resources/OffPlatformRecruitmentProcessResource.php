<?php

namespace App\Http\Resources;

use App\Enums\HiringPlatform;
use App\Traits\HasLocalizedEnums;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\OffPlatformRecruitmentProcess
 */
class OffPlatformRecruitmentProcessResource extends JsonResource
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
        $array = [
            'id' => $this->id,
            'processNumber' => $this->process_number,
            'platform' => $this->localizeEnum($this->platform, HiringPlatform::class),
            'platformOther' => $this->platform_other,
            'department' => $this->department ? (new DepartmentResource($this->department)) : null,
            'classification' => (new ClassificationResource($this->classification)),
        ];

        return $array;
    }
}
