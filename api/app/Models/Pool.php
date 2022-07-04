<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

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
 * @property array $your_impact
 * @property array $pool_status
 * @property string $poster_location
 * @property string $security_clearance
 * @property string $poster_ad_language
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
        'your_impact' => 'array',
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

    public function essentialSkills(): MorphToMany
    {
        return $this->morphToMany(Skill::class, 'pool', 'pools_essential_skills')
            ->withTimestamps()
            ->withPivot('details')
            ->as('pools_essential_skills_pivot');
    }

    public function nonessentialSkills(): MorphToMany
    {
        return $this->morphToMany(Skill::class, 'pool', 'pools_nonessential_skills')
            ->withTimestamps()
            ->withPivot('details')
            ->as('pools_nonessential_skills_pivot');
    }

    /* accessor to obtain Advertisement Status, depends on two variables regarding published and expiry */
    public function getAdvertisementStatusAttribute()
    {
        date_default_timezone_set('America/Vancouver');
        $isPublished = $this->is_published;
        $expiryDate = $this->expiry_date;
        $currentTime = date("Y-m-d H:i:s");
        $isExpired = $currentTime > $expiryDate ? true : false;

        if(!$isPublished){
            return ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT;

        } elseif($isPublished && !$isExpired){
            return ApiEnums::POOL_ADVERTISEMENT_IS_PUBLISHED;

        } elseif($isPublished && $isExpired){
            return ApiEnums::POOL_ADVERTISEMENT_IS_EXPIRED;

        } else{
            return null;

        }
    }
}
