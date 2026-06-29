<?php

namespace App\Http\Resources;

use App\Enums\HiringPlatform;
use App\Models\OffPlatformRecruitmentProcess;
use App\Traits\HasLocalizedEnums;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OffPlatformRecruitmentProcess
 */
class OffPlatformRecruitmentProcessResource extends JsonResource
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
            'processNumber' => $this->process_number,
            'platform' => $this->localizeEnum($this->platform, HiringPlatform::class),
            'platformOther' => $this->platform_other,
            'department' => $this->department ? (new DepartmentResource($this->department)) : null,
            'classification' => (new ClassificationResource($this->classification)),
        ];

        return $array;
    }
}
