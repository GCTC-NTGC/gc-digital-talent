<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
