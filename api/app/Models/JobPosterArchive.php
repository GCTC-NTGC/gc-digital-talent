<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class JobPosterArchive
 *
 * @property string $id
 * @property array $html
 * @property string $type
 * @property Pool $pool
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class JobPosterArchive extends Model
{
    protected $keyType = 'string';

    protected $casts = ['html' => LocalizedString::class];

    protected $fillable = ['html', 'type'];

    public static $generationEagerLoads = [
        'classification',
        'department',
        'poolSkills.skill',
        'workStream',
    ];

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }
}
