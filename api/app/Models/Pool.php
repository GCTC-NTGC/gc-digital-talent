<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Pool
 *
 * @property int $id
 * @property array $name
 * @property array $description
 * @property int $user_id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Pool extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function classifications() {
        return $this->belongsToMany(Classification::class);
    }
    public function operationalRequirements() {
        return $this->belongsToMany(OperationalRequirement::class);
    }
    public function assetCriteria() {
        return $this->belongsToMany(CmoAsset::class, 'asset_cmo_asset_pool');
    }
    public function essentialCriteria() {
        return $this->belongsToMany(CmoAsset::class, 'essential_cmo_asset_pool');
    }

}
