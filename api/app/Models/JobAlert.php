<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * Class JobAlert
 *
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property bool $is_paused
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class JobAlert extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'is_paused' => 'boolean',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasOne<JobAlertFilter, $this> */
    public function jobAlertFilter(): HasOne
    {
        return $this->hasOne(JobAlertFilter::class);
    }
}
