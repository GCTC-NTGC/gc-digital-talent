<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

// Sometimes we have to query for relationship non-nullable fields when they're not needed because of codegen
/** @mixin \App\Models\User */
class UserStubResource extends JsonResource
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
            'email' => $this->email,
        ];
    }
}
