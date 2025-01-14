<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class DevelopmentProgram
 *
 * @property string $id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 * @property array $name
 * @property array $description_for_profile
 * @property array $description_for_nominations
 * @property string $community_id
 */
class DevelopmentProgram extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => 'array',
        'description_for_profile' => 'array',
        'description_for_nominations' => 'array',
    ];

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return BelongsToMany<Classification, $this> */
    public function eligibleClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }
}
