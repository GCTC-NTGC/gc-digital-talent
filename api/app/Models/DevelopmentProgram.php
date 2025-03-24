<?php

namespace App\Models;

use App\Casts\LocalizedString;
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
        'name' => LocalizedString::class,
        'description_for_profile' => LocalizedString::class,
        'description_for_nominations' => LocalizedString::class,
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
