<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class JobAlert
 *
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property bool $is_paused
 * @property string $job_alert_filter_id
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

    protected static function booted(): void
    {
        // Delete the filter after the alert, since the alert holds the foreign key
        static::deleted(function (JobAlert $jobAlert) {
            $jobAlert->jobAlertFilter()->delete();
        });
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<JobAlertFilter, $this> */
    public function jobAlertFilter(): BelongsTo
    {
        return $this->belongsTo(JobAlertFilter::class);
    }
}
