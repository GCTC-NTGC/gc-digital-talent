<?php

namespace App\Models;

use App\Builders\UserBuilder;
use Database\Factories\TalentRequestTrackedUserFactory;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
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
#[Table(name: 'talent_request_tracked_users', keyType: 'string', incrementing: false)]
class TalentRequestTrackedUser extends Pivot
{
    /** @use HasFactory<TalentRequestTrackedUserFactory> */
    use HasFactory;

    use HasUuids;
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

    /**
     * Only keep tracked users whose underlying user the viewer is allowed to see.
     */
    public function scopeWhereAuthorizedToView(Builder $query): Builder
    {
        return $query->whereHas('user', function (Builder $userQuery) {
            /** @var UserBuilder $userQuery */
            $userQuery->whereAuthorizedToView();
        });
    }

    /**
     * Add a live count of the user's skills that match this request's applicant filter skills.
     */
    public function scopeWithSkillCount(Builder $query): Builder
    {
        return $query->addSelect(['skill_count' => UserSkill::query()
            ->selectRaw('count(*)')
            ->whereColumn('user_skills.user_id', 'talent_request_tracked_users.user_id')
            ->whereIn('user_skills.skill_id', function ($subQuery) {
                $subQuery->select('applicant_filter_skill.skill_id')
                    ->from('applicant_filter_skill')
                    ->join('talent_requests', 'talent_requests.applicant_filter_id', '=', 'applicant_filter_skill.applicant_filter_id')
                    ->whereColumn('talent_requests.id', 'talent_request_tracked_users.talent_request_id');
            }),
        ]);
    }

    /**
     * @param  ?array<string>  $decisions
     */
    public function scopeWhereReferralDecisionIn(Builder $query, ?array $decisions): Builder
    {
        return $query->when(
            $decisions,
            fn (Builder $query) => $query->whereIn('referral_decision', $decisions)
        );
    }

    /**
     * @param  ?array<string>  $decisions
     */
    public function scopeWhereSelectionDecisionIn(Builder $query, ?array $decisions): Builder
    {
        return $query->when(
            $decisions,
            fn (Builder $query) => $query->whereIn('selection_decision', $decisions)
        );
    }
}
