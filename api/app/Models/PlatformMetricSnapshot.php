<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Class PlatformMetricSnapshot
 *
 * A precomputed set of platform-wide metrics, written nightly by
 * app:compute-platform-metrics. Reading these is cheap; computing them is not,
 * which is the whole reason the table exists.
 *
 * @property string $id
 * @property int $version
 * @property Carbon $computed_at
 * @property array $metrics
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class PlatformMetricSnapshot extends Model
{
    use HasUuids;

    /**
     * The shape of the `metrics` payload this version of the code writes and
     * understands.
     *
     * Bump it when the JSON structure changes — a renamed key, a new nested
     * level, a changed unit. Changing how a metric's value is calculated
     * without moving any keys does not need a bump.
     *
     * Old rows are kept rather than migrated, so every row stays readable as
     * the shape it was written in. The cost is that immediately after a bump
     * there is no readable snapshot until the next nightly run — callers must
     * handle that, the same way they handle the state before the first run.
     */
    public const SHAPE_VERSION = 1;

    protected $casts = [
        'version' => 'integer',
        'computed_at' => 'datetime',
        'metrics' => 'array',
    ];

    protected $fillable = [
        'version',
        'computed_at',
        'metrics',
    ];

    /**
     * Limit to snapshots this version of the code knows how to interpret.
     *
     * @param  Builder<PlatformMetricSnapshot>  $query
     * @return Builder<PlatformMetricSnapshot>
     */
    public function scopeReadable(Builder $query): Builder
    {
        return $query->where('version', self::SHAPE_VERSION);
    }

    /**
     * The most recent snapshot this code can interpret.
     *
     * Deliberately not "the most recent snapshot" — after a SHAPE_VERSION bump
     * the newest row is one this code cannot map, and returning it would break
     * the caller rather than showing an empty state.
     */
    public static function latestReadable(): ?self
    {
        return self::query()
            ->readable()
            ->orderByDesc('computed_at')
            ->first();
    }
}
