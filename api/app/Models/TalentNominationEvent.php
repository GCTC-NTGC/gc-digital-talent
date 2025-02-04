<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class Talent nomination event
 *
 * @property string $id
 * @property array $name
 * @property array $description
 * @property \Illuminate\Support\Carbon $open_date
 * @property \Illuminate\Support\Carbon $close_date
 * @property array $learn_more_url
 * @property bool $include_leadership_competencies
 * @property string $community_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class TalentNominationEvent extends Model
{
    /** @use HasFactory<\Database\Factories\TalentNominationEventFactory> */
    use HasFactory;

    use LogsActivity;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => LocalizedString::class,
        'description' => LocalizedString::class,
        'open_date' => 'datetime',
        'close_date' => 'datetime',
        'learn_more_url' => LocalizedString::class,
        'include_leadership_competencies' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return BelongsToMany<DevelopmentProgram, $this> */
    public function developmentPrograms(): BelongsTo
    {
        return $this->belongsTo(DevelopmentProgram::class);
    }
}
