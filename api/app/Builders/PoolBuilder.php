<?php

namespace App\Builders;

use App\Enums\PoolStatus;
use App\Models\Team;
use Illuminate\Database\Eloquent\Builder;

class PoolBuilder extends Builder
{
    public function wherePublished(): self
    {
        return $this->where('published_at', '<=', now());
    }

    public function whereNotClosed(): self
    {
        return $this->where(function ($query) {
            $query->whereNull('closing_date')
                ->orWhere('closing_date', '>', now());
        });
    }

    public function whereClosed(): self
    {
        return $this->where('closing_date', '<=', now());
    }

    public function whereCurrentlyActive(): self
    {
        return $this->wherePublished()->whereNotClosed();
    }

    public function whereNotArchived(): self
    {
        return $this->where(function ($query) {
            $query->whereNull('archived_at')
                ->orWhere('archived_at', '>', now());
        });
    }

    public function name(?string $name): self
    {

        if (! $name) {
            return $this;
        }

        return $this->where(function ($query) use ($name) {
            $term = sprintf('%%%s%%', $name);

            return $query->where('name->en', 'ilike', $term)
                ->orWhere('name->fr', 'ilike', $term);
        });
    }

    public function processNumber(?string $number): self
    {
        if (! $number) {
            return $this;
        }

        return $this->where('process_number', 'ilike', sprintf('%%%s%%', $number));
    }

    public function team(?string $team): self
    {
        if (! $team) {
            return $this;
        }

        return $this->whereHas('legacyTeam', function ($query) use ($team) {
            Team::scopeDisplayName($query, $team);
        });
    }

    public function statuses(?array $statuses): self
    {
        if (! empty($statuses)) {

            $this->where(function ($query) use ($statuses) {

                if (in_array(PoolStatus::ARCHIVED->name, $statuses)) {
                    $query->orWhere('archived_at', '<=', now());
                }

                if (in_array(PoolStatus::CLOSED->name, $statuses)) {
                    $query->orWhere(function ($query) {
                        $query->whereClosed()
                            ->whereNotArchived($query);
                    });
                }

                if (in_array(PoolStatus::PUBLISHED->name, $statuses)) {
                    $query->orWhere(function ($query) {
                        $query->wherePublished()
                            ->whereNotClosed()
                            ->whereNotArchived();
                    });
                }

                if (in_array(PoolStatus::DRAFT->name, $statuses)) {
                    $query->orWhereNull('published_at');
                }
            });

            return $this;
        }

        // empty defaults to all but archived
        return $this->whereNotArchived();

    }
}
