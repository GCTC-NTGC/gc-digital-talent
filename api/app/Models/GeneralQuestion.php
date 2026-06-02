<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * Class General Question
 *
 * @property string $id
 * @property string $pool_id
 * @property array $question
 * @property int $sort_order
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class GeneralQuestion extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'question' => LocalizedString::class,
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'question',
        'sort_order',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly((['*']))
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /** @return BelongsTo<Pool, $this> */
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    /** @return HasMany<GeneralQuestionResponse, $this> */
    public function generalQuestionResponses(): HasMany
    {
        return $this->hasMany(GeneralQuestionResponse::class);
    }
}
