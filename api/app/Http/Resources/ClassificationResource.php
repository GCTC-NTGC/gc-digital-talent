<?php

namespace App\Http\Resources;

use App\Models\Classification;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Classification */
class ClassificationResource extends JsonResource
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
            'group' => $this->group,
            'level' => $this->level,
            'name' => $this->name,
            'minSalary' => $this->min_salary,
            'maxSalary' => $this->max_salary,
            'genericJobTitles' => GenericJobTitleResource::collection($this->whenLoaded('genericJobTitles')),
        ];
    }
}
