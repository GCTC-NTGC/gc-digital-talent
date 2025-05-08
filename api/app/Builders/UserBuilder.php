<?php

namespace App\Builders;

use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class UserBuilder extends Builder
{
    /**
     * Get users that have completed their profile
     */
    public function whereProfileComplete(?bool $isProfileComplete): self
    {
        if ($isProfileComplete) {
            $this->whereNotNull('first_name');
            $this->whereNotNull('last_name');
            $this->whereNotNull('email');
            $this->whereNotNull('telephone');
            $this->whereNotNull('preferred_lang');
            $this->whereNotNull('preferred_language_for_interview');
            $this->whereNotNull('preferred_language_for_exam');
            $this->whereNotNull('current_province');
            $this->whereNotNull('current_city');
            $this->where(function ($query) {
                $query->whereNotNull('looking_for_english');
                $query->orWhereNotNull('looking_for_french');
                $query->orWhereNotNull('looking_for_bilingual');
            });
            $this->whereNotNull('computed_is_gov_employee');
            $this->where(function (Builder $query) {
                $query->where('has_priority_entitlement', false)
                    ->orWhere(function (Builder $query) {
                        $query->where('has_priority_entitlement', true)
                            ->whereNotNull('priority_number');
                    });
            });
            $this->whereNotNull('location_preferences');
            $this->whereJsonLength('location_preferences', '>', 0);
            $this->whereJsonLength('position_duration', '>', 0);
            $this->whereNotNull('citizenship');
            $this->whereNotNull('armed_forces_status');
        }

        return $this;
    }

    /**
     * Filters users by the Pools they are in.
     *
     * @param  array  $poolFilters  Each pool filter must contain a poolId, and may contain expiryStatus, statuses, and suspendedStatus fields
     */
    public function wherePool(?array $poolFilters): self
    {
        if (empty($poolFilters)) {
            return $this;
        }

        // Pool acts as an OR filter. The query should return valid candidates in ANY of the pools.
        return $this->whereExists(function ($query) use ($poolFilters) {
            $query->select('id')
                ->from('pool_candidates')
                ->whereColumn('pool_candidates.user_id', 'users.id')
                ->where(function ($query) use ($poolFilters) {
                    $makePoolFilterClause = function ($filter) {
                        return function ($query) use ($filter) {
                            $query->where('pool_candidates.pool_id', $filter['poolId']);
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == CandidateExpiryFilter::ACTIVE->name) {
                                    $query->whereDate('expiry_date', '>=', date('Y-m-d'))
                                        ->orWhereNull('expiry_date');
                                } elseif (array_key_exists('expiryStatus', $filter) && $filter['expiryStatus'] == CandidateExpiryFilter::EXPIRED->name) {
                                    $query->whereDate('expiry_date', '<', date('Y-m-d'));
                                }
                            });
                            if (array_key_exists('statuses', $filter) && ! empty($filter['statuses'])) {
                                $query->whereIn('pool_candidates.pool_candidate_status', $filter['statuses']);
                            }
                            $query->where(function ($query) use ($filter) {
                                if (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == CandidateSuspendedFilter::ACTIVE->name) {
                                    $query->where('suspended_at', '>=', Carbon::now())
                                        ->orWhereNull('suspended_at');
                                } elseif (array_key_exists('suspendedStatus', $filter) && $filter['suspendedStatus'] == CandidateSuspendedFilter::SUSPENDED->name) {
                                    $query->where('suspended_at', '<', Carbon::now());
                                }
                            });

                            return $query;
                        };
                    };
                    foreach ($poolFilters as $index => $filter) {
                        if ($index == 0) {
                            $query->where($makePoolFilterClause($filter));
                        } else {
                            $query->orWhere($makePoolFilterClause($filter));
                        }
                    }

                    return $query;
                });
        });
    }
}
