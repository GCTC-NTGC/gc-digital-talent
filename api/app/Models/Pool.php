<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
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
 * @property array $key_tasks
 * @property array $pool_status
 * @property boolean $is_published
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $expiry_date
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
        'key_tasks' => 'array',
        'expiry_date' => 'date',
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

    /* accessor to obtain Advertisement Status, depends on two variables regarding published and expiry */
    public function getAdvertisementStatus()
    {
        $isPublished = $this->is_published;
        $expiryDate = $this->expiry_date;
        $currentTime = date("Y-m-d H:i:s");
        $isExpired = $currentTime>$expiryDate ? true : false;

        if(!$isPublished){
            return [
               "advertisement_status" => ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT,
            ];
        } elseif($isPublished && !$isExpired){
            return [
                "advertisement_status" => ApiEnums::POOL_ADVERTISEMENT_IS_PUBLISHED,
            ];
        } elseif($isPublished && $isExpired){
            return [
                "advertisement_status" => ApiEnums::POOL_ADVERTISEMENT_IS_EXPIRED,
            ];
        } else{
            return [
                "advertisement_status" => null,
            ];
        }
    }
}
