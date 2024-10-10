<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Classification */
class ClassificationResource extends JsonResource
{
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
            'group' => $this->group,
            'level' => $this->level,
            'name' => $this->name,
            'minSalary' => $this->min_salary,
            'maxSalary' => $this->max_salary,
            'genericJobTitles' => GenericJobTitleResource::collection($this->whenLoaded('genericJobTitles')),
        ];
    }
}
