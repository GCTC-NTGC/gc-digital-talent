<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class CommunityInterest
 *
 * @property string $id
 */
class CommunityInterest extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return BelongsToMany<WorkStream, $this> */
    public function workStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class);
    }

    /** @return HasMany<DevelopmentProgramInterest, $this> */
    public function interestInDevelopmentPrograms(): HasMany
    {
        return $this->hasMany(DevelopmentProgramInterest::class);
    }
}
