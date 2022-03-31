<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Pool
 *
 * @property int $id
 * @property array $name
 * @property string $key
 * @property array $description
 * @property int $user_id
 * @property array $operational_requirements
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Pool extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'operational_requirements' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }
    public function assetCriteria(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class, 'asset_cmo_asset_pool');
    }
    public function essentialCriteria(): BelongsToMany
    {
        return $this->belongsToMany(CmoAsset::class, 'essential_cmo_asset_pool');
    }
    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }
}
