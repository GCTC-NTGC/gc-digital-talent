<?php

namespace App\Models;

use App\Builders\UserBuilder;
use App\Enums\TalentRequestSource;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Enums\TalentRequestTrackedUserStatus;
use Database\Factories\TalentRequestTrackedUserFactory;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Carbon;
use SortDirection;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * Class TalentRequestTrackedUser
 *
 * @property string $id
 * @property string $user_id
 * @property string $talent_request_id
 * @property ?string $referral_decision
 * @property ?string $selection_decision
 * @property ?string $not_referred_reason
 * @property ?string $not_selected_reason
 * @property-read ?string $status
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
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

    /** @return HasManyThrough<PoolCandidate, User, $this> */
    public function matchingQualifiedInPoolSources(): HasManyThrough
    {
        // talentRequest.applicantFilter.* is pre-loaded via @with on the schema field
        $filter = $this->talentRequest->applicantFilter;

        return $this->hasManyThrough(PoolCandidate::class, User::class, 'id', 'user_id', 'user_id', 'id')
            ->whereMatchesTalentRequest([
                'qualifiedInClassifications' => $filter->qualifiedInClassifications
                    ->map(fn ($c) => ['group' => $c->group, 'level' => $c->level])
                    ->toArray(),
                'qualifiedInWorkStreams' => $filter->qualifiedInWorkStreams
                    ->map(fn ($ws) => ['id' => $ws->id])
                    ->toArray(),
                'community' => $filter->community_id,
            ])
            ->whereAuthorizedToView();
    }

    /** @return Attribute<array<string>, never> */
    protected function sources(): Attribute
    {
        return Attribute::get(function (): array {
            /** @var array<string> $sources */
            $sources = $this->hasQualifiedInPoolSource()
                ? [TalentRequestSource::QUALIFIED_IN_POOL->name]
                : [];

            return $sources;
        });
    }

    private function hasQualifiedInPoolSource(): bool
    {
        if (isset($this->has_prequalified_source)) {
            return (bool) $this->has_prequalified_source;
        }

        return $this->matchingQualifiedInPoolSources()->exists();
    }

    /** @return Attribute<array{}, never> */
    protected function matchingAtLevelSources(): Attribute
    {
        return Attribute::get(fn (): array => []);
    }

    /** @return Attribute<array{}, never> */
    protected function matchingAdvancementSources(): Attribute
    {
        return Attribute::get(fn (): array => []);
    }

    /**
     * The user's referral summary (delegates to the User accessor so the
     * tracked-user view can show the same user-wide aggregate).
     *
     * @return Attribute<array{referredCount: int, notSelectedReasons: array<int, array{reason: string, count: int}>}, never>
     */
    protected function referralSummary(): Attribute
    {
        return Attribute::get(fn () => $this->user->referral_summary);
    }

    /**
     * The tracked user's current position in the referral → selection flow,
     * as a TalentRequestTrackedUserStatus name. A selection decision supersedes
     * the referral decision (matching whereStatusIn and the status chip).
     *
     * @return Attribute<?string, never>
     */
    protected function status(): Attribute
    {
        return Attribute::make(
            get: fn (): ?string => match (true) {
                $this->selection_decision === TalentRequestTrackedUserSelectionDecision::SELECTED->name => TalentRequestTrackedUserStatus::SELECTED->name,
                $this->selection_decision === TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name => TalentRequestTrackedUserStatus::NOT_SELECTED->name,
                $this->referral_decision === TalentRequestTrackedUserReferralDecision::REFERRED->name => TalentRequestTrackedUserStatus::REFERRED->name,
                $this->referral_decision === TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name => TalentRequestTrackedUserStatus::NOT_REFERRED->name,
                default => null,
            },
        );
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

    public function scopeWithSources(Builder $query, string $talentRequestId): Builder
    {
        $filter = TalentRequest::with([
            'applicantFilter.qualifiedInClassifications',
            'applicantFilter.qualifiedInWorkStreams',
        ])->find($talentRequestId)?->applicantFilter;

        if (! $filter) {
            return $query;
        }

        return $query->addSelect(['has_prequalified_source' => PoolCandidate::query()
            ->selectRaw('1')
            ->whereColumn('pool_candidates.user_id', 'talent_request_tracked_users.user_id')
            ->whereMatchesTalentRequest([
                'qualifiedInClassifications' => $filter->qualifiedInClassifications
                    ->map(fn ($c) => ['group' => $c->group, 'level' => $c->level])
                    ->toArray(),
                'qualifiedInWorkStreams' => $filter->qualifiedInWorkStreams
                    ->map(fn ($ws) => ['id' => $ws->id])
                    ->toArray(),
                'community' => $filter->community_id,
            ])
            ->limit(1),
        ]);
    }

    /**
     * Filter by a tracked user's current position in the referral → selection flow,
     * mirroring the status chip (a selection decision supersedes the referral decision).
     * Multiple statuses are OR'd together.
     *
     * @param  ?array<int, string>  $statuses
     */
    public function scopeWhereStatusIn(Builder $query, ?array $statuses): Builder
    {
        return $query->when($statuses, fn (Builder $query) => $query->where(fn (Builder $query) => $query
            ->when(
                in_array(TalentRequestTrackedUserStatus::NOT_REFERRED->name, $statuses),
                fn (Builder $query) => $query
                    ->orWhere('referral_decision', TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name)
                    ->whereNull('selection_decision')
            )
            ->when(
                in_array(TalentRequestTrackedUserStatus::REFERRED->name, $statuses),
                fn (Builder $query) => $query->orWhere(fn (Builder $query) => $query
                    ->where('referral_decision', TalentRequestTrackedUserReferralDecision::REFERRED->name)
                    ->whereNull('selection_decision'))
            )
            ->when(
                in_array(TalentRequestTrackedUserStatus::SELECTED->name, $statuses),
                fn (Builder $query) => $query->orWhere('selection_decision', TalentRequestTrackedUserSelectionDecision::SELECTED->name)
            )
            ->when(
                in_array(TalentRequestTrackedUserStatus::NOT_SELECTED->name, $statuses),
                fn (Builder $query) => $query->orWhere('selection_decision', TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name)
            )
        ));
    }

    public function scopeOrderBySkillCount(Builder $query, ?array $args): Builder
    {
        $direction = match ($args['order'] ?? null) {
            'ASC' => SortDirection::Ascending,
            'DESC' => SortDirection::Descending,
            default => null,
        };

        return $query->when($direction, fn (Builder $query) => $query->orderBy('skill_count', $direction));
    }

    public function scopeWhereUserNameOrEmail(Builder $query, ?string $search): Builder
    {
        return $query->when(
            $search,
            fn (Builder $query) => $query->whereHas('user', fn (Builder $userQuery) => $userQuery
                ->where(fn (Builder $nameQuery) => $nameQuery
                    ->whereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", ["%{$search}%"])
                    ->orWhere('first_name', 'ilike', "%{$search}%")
                    ->orWhere('last_name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")))
        );
    }

    public function referred(bool $save = true)
    {
        $this->referral_decision = TalentRequestTrackedUserReferralDecision::REFERRED->name;
        $this->not_referred_reason = null;
        $this->selection_decision = null;
        $this->not_selected_reason = null;

        if ($save) {
            $this->save();
        }
    }

    public function notReferred(string $notReferredReason)
    {
        $this->referral_decision = TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name;
        $this->not_referred_reason = $notReferredReason;
        $this->selection_decision = null;
        $this->not_selected_reason = null;

        $this->save();
    }

    public function selected()
    {
        $this->referred(save: false);
        $this->selection_decision = TalentRequestTrackedUserSelectionDecision::SELECTED->name;
        $this->not_referred_reason = null;

        $this->save();
    }

    public function notSelected(string $notSelectedReason)
    {
        $this->referred(save: false);
        $this->selection_decision = TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name;
        $this->not_selected_reason = $notSelectedReason;

        $this->save();
    }
}
