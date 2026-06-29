<?php

namespace App\Http\Resources;

use App\Models\Community;
use App\Models\WorkStream;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkStream */
class WorkStreamResource extends JsonResource
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
            'key' => $this->key,
            'name' => $this->name,
            'plainLanguageName' => $this->plain_language_name,
            'community' => $this->community_id ? (new CommunityResource(Community::find($this->community_id))) : null,
        ];
    }
}
