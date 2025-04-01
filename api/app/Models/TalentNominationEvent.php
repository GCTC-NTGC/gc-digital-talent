<?php

namespace App\Models;

use App\Casts\LocalizedString;
use App\Enums\TalentNominationEventStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
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
    public function developmentPrograms(): BelongsToMany
    {
        return $this->belongsToMany(DevelopmentProgram::class);
    }

    protected function status(): Attribute
    {
        /** @disregard P1003 Not using values */
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (Carbon::parse($attributes['open_date'])->isPast() && Carbon::parse($attributes['close_date'])->isFuture()) {
                    return TalentNominationEventStatus::ACTIVE->name;
                }
                if (Carbon::parse($attributes['close_date'])->isFuture()) {
                    return TalentNominationEventStatus::UPCOMING->name;
                }
                if (Carbon::parse($attributes['close_date'])->isPast()) {
                    return TalentNominationEventStatus::PAST->name;
                }

                return null;
            },
        );
    }

    public static function scopeStatus(Builder $query, ?string $status)
    {
        if (! $status) {
            return $query;
        }
        if ($status === TalentNominationEventStatus::ACTIVE->name) {
            return $query->where('open_date', '<', now())->where('close_date', '>', now());
        }
        if ($status === TalentNominationEventStatus::UPCOMING->name) {
            return $query->where('open_date', '>', now());
        }
        if ($status === TalentNominationEventStatus::PAST->name) {
            return $query->where('close_date', '<', now());
        }
    }

    public function scopeCanManage(Builder $query, ?bool $canManage): void
    {
        if (! $canManage) {
            return;
        }

        /** @var \App\Models\User | null */
        $user = Auth::user();

        if ($user?->isAbleTo('update-team-talentNominationEvent')) {
            $communities = $user->rolesTeams()
                ->where('teamable_type', "App\Models\Community")
                ->get();
            $communityIds = $communities->filter(function ($community) use ($user) {
                return $user->isAbleTo('update-team-talentNominationEvent', $community);
            })->pluck('teamable_id');

            $query->whereHas('community', function (Builder $query) use ($communityIds) {
                return $query->whereIn('community_id', $communityIds);
            });

            return;
        }

        // fall through, return nothing
        $query->where('id', null);
    }

    /** @return HasMany<TalentNominationGroup, $this> */
    public function talentNominationGroups(): HasMany
    {
        return $this->hasMany(TalentNominationGroup::class);
    }
}
