<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class JobAlertNotifiedPool
 *
 * A pool a user has already been alerted about, so it is sent at most once per user.
 *
 * @property string $id
 * @property string $user_id
 * @property string $pool_id
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class JobAlertNotifiedPool extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }
}
