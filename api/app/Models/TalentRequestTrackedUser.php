<?php

namespace App\Models;

use Database\Factories\TalentRequestTrackedUserFactory;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * Class TalentRequestTrackedUser
 *
 * @property string $id
 * @property string $user_id
 * @property string $talent_request_id
 * @property string $referral_decision
 * @property string $selection_decision
 * @property string $not_referred_reason
 * @property string $not_selected_reason
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property ?Carbon $deleted_at
 */
#[Table(keyType: 'string', incrementing: false)]
class TalentRequestTrackedUser extends Pivot
{
    /** @use HasFactory<TalentRequestTrackedUserFactory> */
    use HasFactory;

    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /** @return BelongsTo<TalentRequest, $this> */
    public function talentRequest(): BelongsTo
    {
        return $this->belongsTo(TalentRequest::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
