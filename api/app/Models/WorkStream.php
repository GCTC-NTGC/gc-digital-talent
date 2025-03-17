<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

/**
 * Class WorkStream
 *
 * @property string $id
 * @property array $name
 * @property array $plain_language_name
 * @property Community $community
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class WorkStream extends Model
{
    /** @use HasFactory<\Database\Factories\WorkStreamFactory> */
    use HasFactory;

    use HasJsonRelationships;

    protected $keyType = 'string';

    protected $casts = [
        'name' => LocalizedString::class,
        'plain_language_name' => LocalizedString::class,
    ];

    protected $fillable = [
        'key',
        'name',
        'plain_language_name',
        'community_id',
    ];

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Re-useable scope to filter by an array of workStream ids
     *
     * @param  array<string>|null  $workStreamIds  An array of workStream ids
     */
    public static function scopeWorkStreamsByIds(Builder $query, ?array $workStreamIds): Builder
    {
        if (empty($workStreamIds)) {
            return $query;
        }

        $query->whereIn('id', $workStreamIds);

        return $query;
    }
}
