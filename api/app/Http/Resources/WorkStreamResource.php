<?php

namespace App\Http\Resources;

use App\Models\Community;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\WorkStream */
class WorkStreamResource extends JsonResource
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
            'key' => $this->key,
            'name' => $this->name,
            'plainLanguageName' => $this->plain_language_name,
            'community' => $this->community_id ? (new CommunityResource(Community::find($this->community_id))) : null,
        ];
    }
}
