<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

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
 * @property array $advertisement_location
 * @property string $security_clearance
 * @property string $advertisement_language
 * @property string $stream
 * @property string $process_number
 * @property string $publishing_group
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $closing_date
 * @property Illuminate\Support\Carbon $published_at
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
        'advertisement_location' => 'array',
        'your_impact' => 'array',
        'closing_date' => 'datetime',
        'published_at' => 'datetime',
        'is_remote' => 'boolean'
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'is_remote',
        'closing_date',
        'published_at',
        'name',
        'key_tasks',
        'stream',
        'security_clearance',
        'advertisement_language',
        'description',
        'your_impact',
        'advertisement_location',
        'publishing_group',
        'process_number',
        'operational_requirements',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }
    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }

    public function essentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pools_essential_skills');
    }

    public function nonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pools_nonessential_skills');
    }

    /* accessor to obtain Advertisement Status, depends on two variables regarding published and expiry */
    public function getAdvertisementStatusAttribute()
    {
        // given database is functioning in UTC, all backend should consistently enforce the same timezone
        $publishedDate = $this->published_at;
        $closedDate = $this->closing_date;
        $currentTime = date("Y-m-d H:i:s");
        if ($closedDate != null) {
            $isClosed = $currentTime >= $closedDate ? true : false;
        }
        else {
            $isClosed = false;
        }
        if ($publishedDate != null) {
            $isPublished = $currentTime >= $publishedDate ? true : false;
        }
        else {
            $isPublished = false;
        }

        if (!$isPublished) {
            return ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT;
        } elseif ($isPublished && !$isClosed) {
            return ApiEnums::POOL_ADVERTISEMENT_IS_PUBLISHED;
        } elseif ($isPublished && $isClosed) {
            return ApiEnums::POOL_ADVERTISEMENT_IS_CLOSED;
        } else {
            return null;
        }
    }

    public function scopeWasPublished(Builder $query, ?array $args)
    {
        $query->where('published_at', '<=', Carbon::now()->toDateTimeString());
        return $query;
    }
}
