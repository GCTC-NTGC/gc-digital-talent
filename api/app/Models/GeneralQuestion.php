<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class General Question
 *
 * @property string $id
 * @property string $pool_id
 * @property array $question
 * @property int $sort_order
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
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
        'question' => 'array',
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
            ->dontSubmitEmptyLogs();
    }

    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    public function generalQuestionResponses(): HasMany
    {
        return $this->hasMany(GeneralQuestionResponse::class);
    }
}
