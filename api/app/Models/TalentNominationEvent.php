<?php

namespace App\Models;

use App\Casts\LocalizedString;
use App\Enums\TalentNominationEventStatus;
use Carbon\Carbon;
use Database\Factories\TalentNominationEventFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

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
 * @property string $status
 * @property bool $include_nine_box
 * @property bool $require_reference_for_advancement
 * @property ?array $custom_instructions
 * @property ?string $contact_email
 */
class TalentNominationEvent extends Model
{
    /** @use HasFactory<TalentNominationEventFactory> */
    use HasFactory;

    use HasRelationships;
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
        'include_nine_box' => 'boolean',
        'require_reference_for_advancement' => 'boolean',
        'include_leadership_competencies' => 'boolean',
        'custom_instructions' => LocalizedString::class,
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['*'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return BelongsToMany<CommunityDevelopmentProgram, $this, CommunityDevelopmentProgramTalentNominationEvent> */
    public function communityDevelopmentPrograms(): BelongsToMany
    {
        return $this->belongsToMany(CommunityDevelopmentProgram::class, 'community_development_program_talent_nomination_event')
            ->using(CommunityDevelopmentProgramTalentNominationEvent::class)
            ->withPivot(['description_for_nominations']);
    }

    // allow for downloads and the like to skip working with the pivot
    // will fetch with soft deleted intermediate CommunityDevelopmentProgram
    public function developmentProgramsThroughPivot(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->communityDevelopmentPrograms(), (new CommunityDevelopmentProgram())->developmentProgram())
            ->withTrashed('community_development_program.deleted_at');
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

        /** @var User | null */
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

    public static function scopeWithPolicyEagerLoads(Builder $query): Builder
    {
        return $query->with(['community.team']);
    }
}
