<?php

namespace App\Http\Resources;

use App\Enums\PoolStream;
use App\Traits\HasLocalizedEnums;
use Illuminate\Http\Resources\Json\JsonResource;

class PoolResource extends JsonResource
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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'stream' => $this->localizeEnum($this->stream, PoolStream::class),
            'classification' => (new ClassificationResource($this->classification)),
            'closingDate' => $this->closing_date,
        ];
    }
}
