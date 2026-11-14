<?php

namespace App\Builders;

use App\Enums\LanguageAbility;
use App\Enums\PoolLanguage;
use App\Enums\PoolPublishedRange;
use App\Enums\PoolSkillType;
use App\Enums\PoolStatus;
use App\Enums\SalaryRange;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class PoolBuilder extends Builder
{
    // column holding the relevance score, added by withMatchScore
    public const MATCH_SCORE_COLUMN = 'match_score';

    // how much each scored filter contributes to the match score
    // every component is normalized to 0..1 before weighting
    public const MATCH_SCORE_WEIGHTS = [
        'keywords' => 1.0,
        'skills' => 1.0,
    ];

    /**
     * Score components added by filter scopes, totalled by withMatchScore
     *
     * @var array<int, array{sql: string, bindings: array<int, mixed>}>
     */
    protected array $matchScoreParts = [];

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
        return $this->where(function ($query) {
            $query->whereNotNull('published_at')
                ->where('closing_date', '<=', now());
        });
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

    public function whereIsHidden(?bool $isHidden): self
    {
        return $this->when(isset($isHidden), fn (self $query) => $query
            ->where('is_hidden', $isHidden));
    }

    public function whereNotHidden(): self
    {
        return $this->where('is_hidden', false);
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
                            ->whereNotArchived();
                    });
                }

                // open pools
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

    public function generalSearch(?string $term): self
    {
        if (! $term) {
            return $this;
        }

        return $this->where(function ($query) use ($term) {
            $query->name($term)
                ->orWhere(function ($query) use ($term) {
                    $query->processNumber($term);
                });
        });
    }

    public function whereWorkStreamsIn(?array $streams): self
    {

        if (empty($streams)) {
            return $this;
        }

        return $this->whereHas('workStream', function ($query) use ($streams) {
            $query->whereIn('id', $streams);
        });
    }

    public function whereClassifications(?array $classifications): self
    {
        if (empty($classifications)) {
            return $this;
        }

        return $this->whereHas('classification', function ($query) use ($classifications) {
            $query->where(function ($query) use ($classifications) {
                foreach ($classifications as $classification) {
                    $query->orWhere(function ($query) use ($classification) {
                        $query->where('group', $classification['group'])->where('level', $classification['level']);
                    });
                }
            });
        });

    }

    // just searching pool name to start
    public function keywordSearch(?array $terms): self
    {
        if (empty($terms)) {
            return $this;
        }

        $this->where(function ($query) use ($terms) {
            foreach ($terms as $term) {
                $query->name($term);
            }
        });

        // every term already matches somewhere in the name, so score how well:
        // a whole word scores 1.0 and part of a word 0.5, averaged over the terms
        $termScores = [];
        $bindings = [];
        foreach ($terms as $term) {
            $termScores[] = "CASE WHEN pools.name->>'en' ~* ? OR pools.name->>'fr' ~* ? THEN 1.0 ELSE 0.5 END";
            // a word is bounded by the start, end or a non-word character, so terms like `c++` and `.net` count too
            $wholeWord = '(^|\\W)'.preg_quote($term).'($|\\W)';
            array_push($bindings, $wholeWord, $wholeWord);
        }

        return $this->addMatchScore(
            sprintf('(%s) / %d.0', implode(' + ', $termScores), count($terms)),
            $bindings,
            self::MATCH_SCORE_WEIGHTS['keywords'],
        );
    }

    // filter by enum PoolAreaOfSelection options
    public function whereAreaOfSelectionIn(?array $areasOfSelection): self
    {
        if (empty($areasOfSelection)) {
            return $this;
        }

        return $this->whereIn('area_of_selection', $areasOfSelection);
    }

    public function whereDepartmentsIn(?array $departmentIds): self
    {
        if (empty($departmentIds)) {
            return $this;
        }

        return $this->whereIn('department_id', $departmentIds);
    }

    public function whereClassificationsIn(?array $classificationIds): self
    {
        if (empty($classificationIds)) {
            return $this;
        }

        return $this->whereIn('classification_id', $classificationIds);
    }

    // filter published at by various enum PoolPublishedRange options
    public function wherePublishedAtIn(?array $publicationRanges): self
    {
        if (empty($publicationRanges)) {
            return $this;
        }

        return $this->where(function ($query) use ($publicationRanges) {
            $nowSub48Hours = now()->subHours(48);
            $nowSub30Days = now()->subDays(30);

            if (in_array(PoolPublishedRange::UNDER_48_HOURS->name, $publicationRanges)) {
                $query->orWhere('published_at', '>=', $nowSub48Hours);
            }

            if (in_array(PoolPublishedRange::UNDER_30_DAYS->name, $publicationRanges)) {
                $query->orWhere('published_at', '>=', $nowSub30Days);
            }

            if (in_array(PoolPublishedRange::OVER_30_DAYS->name, $publicationRanges)) {
                $query->orWhere('published_at', '<', $nowSub30Days);
            }
        });
    }

    // pool must have at least one of the skills, essential or nonessential
    public function whereSkillsIn(?array $skillIds): self
    {
        if (empty($skillIds)) {
            return $this;
        }

        // essential skills count for more than nonessential ones
        $rowWeight = sprintf(
            "CASE pool_skill.type WHEN '%s' THEN 1.0 ELSE 0.5 END",
            PoolSkillType::ESSENTIAL->name
        );

        return $this->whereHas('poolSkills', function ($query) use ($skillIds) {
            $query->whereIn('skill_id', $skillIds);
        })->addOverlapScore('poolSkills', 'skill_id', $skillIds, self::MATCH_SCORE_WEIGHTS['skills'], $rowWeight);
    }

    // filter given enum LanguageAbility options, map to pool's enum PoolLanguage
    public function whereLanguagesIn(?array $languageAbilities): self
    {
        if (empty($languageAbilities)) {
            return $this;
        }

        return $this->where(function ($query) use ($languageAbilities) {
            // always match with VARIOUS
            $query->orWhere('advertisement_language', PoolLanguage::VARIOUS->name);

            if (in_array(LanguageAbility::ENGLISH->name, $languageAbilities)) {
                $query->orWhere(function ($query) {
                    $query->where('advertisement_language', PoolLanguage::ENGLISH->name);
                });
            }

            if (in_array(LanguageAbility::FRENCH->name, $languageAbilities)) {
                $query->orWhere(function ($query) {
                    $query->where('advertisement_language', PoolLanguage::FRENCH->name);
                });
            }

            if (in_array(LanguageAbility::BILINGUAL->name, $languageAbilities)) {
                $query->orWhere(function ($query) {
                    $query
                        ->orWhere('advertisement_language', PoolLanguage::VARIOUS_BILINGUAL->name)
                        ->orWhere('advertisement_language', PoolLanguage::BILINGUAL_INTERMEDIATE->name)
                        ->orWhere('advertisement_language', PoolLanguage::BILINGUAL_ADVANCED->name);
                });
            }
        });
    }

    // filter given enum SalaryRange option, map to pool's classification min salary
    public function whereSalaryRangeIn(?string $salaryRange): self
    {
        if (empty($salaryRange)) {
            return $this;
        }

        return $this->whereHas('classification', function ($query) use ($salaryRange) {
            // range only needs to equal/best the minimum for the classification
            $query->where(function ($query) use ($salaryRange) {
                if ((SalaryRange::BETWEEN_0_39999->name === $salaryRange)) {
                    $query->orWhere(function ($query) {
                        $query
                            ->where('min_salary', '>=', 0)
                            ->where('min_salary', '<', 40000);
                    });
                }
                if ((SalaryRange::BETWEEN_40000_59999->name === $salaryRange)) {
                    $query->orWhere(function ($query) {
                        $query
                            ->where('min_salary', '>=', 40000)
                            ->where('min_salary', '<', 60000);
                    });
                }
                if ((SalaryRange::BETWEEN_60000_79999->name === $salaryRange)) {
                    $query->orWhere(function ($query) {
                        $query
                            ->where('min_salary', '>=', 60000)
                            ->where('min_salary', '<', 80000);
                    });
                }
                if ((SalaryRange::BETWEEN_80000_99999->name === $salaryRange)) {
                    $query->orWhere(function ($query) {
                        $query
                            ->where('min_salary', '>=', 80000)
                            ->where('min_salary', '<', 100000);
                    });
                }
                if ((SalaryRange::BETWEEN_100000_119999->name === $salaryRange)) {
                    $query->orWhere(function ($query) {
                        $query
                            ->where('min_salary', '>=', 100000)
                            ->where('min_salary', '<', 120000);
                    });
                }
                if ((SalaryRange::OVER_120000->name === $salaryRange)) {
                    $query->orWhere(function ($query) {
                        $query
                            ->where('min_salary', '>=', 120000);
                    });
                }
            });
        });
    }

    /**
     * Custom sort to handle issues with how laravel aliases
     * aggregate selects and orderBys for json fields in `lighthouse-php`
     *
     * The column used in the orderBy is `table_aggregate_column->property`
     * But is actually aliased to snake case `table_aggregate_columnproperty`
     */
    public function orderByWorkStreamName(?array $args): self
    {
        $order = $args['order'] ?? null;
        $locale = isset($args['locale']) ? strtolower($args['locale']) : null;

        if ($order && $locale) {
            return $this->withMax('workStream', 'name->'.$locale)->orderBy('work_stream_max_name'.$locale, $order);
        }

        return $this;
    }

    public function orderByPoolBookmarks(?array $args): self
    {
        /** @var User|null */
        $user = Auth::user();
        $order = $args['order'] ?? null;

        // order the pools so that the bookmarks connected to current user sticks to the top
        if ($order && $user) {
            return $this->orderBy(
                $user->selectRaw('1')
                    ->join('pool_user_bookmarks', 'pool_user_bookmarks.user_id', '=', 'users.id')
                    ->where('pool_user_bookmarks.user_id', $user->id)
                    ->whereColumn('pool_user_bookmarks.pool_id', 'pools.id')
            );
        }

        return $this;
    }

    // A scope for a simple orderBy on a column.  Allows for nulls first or last.
    public function orderByColumn(?array $args): self
    {
        // user input: DO NOT USE DIRECTLY IN SQL!
        $inputColumn = $args['column'];
        $inputOrder = $args['order'];
        $inputNulls = $args['nulls'] ?? null;

        // build column name qualified with table name
        $tableName = $this->model->getTable();
        $columnName = Arr::first(Schema::getColumnListing($tableName), fn ($columnName) => strcasecmp($columnName, $inputColumn) == 0);
        if (empty($columnName)) {
            throw new \Exception('Invalid column name');
        }
        $columnSql = "\"$tableName\".\"$columnName\"";

        // build order direction while verifying that option is valid
        $orderOptionSql = match ($inputOrder) {
            'ASC' => 'ASC',
            'DESC' => 'DESC',
            default => throw new \Exception('Invalid order option'),
        };

        // build nulls option while verifying that option is valid
        $nullsOptionSql = match ($inputNulls) {
            'ORDER_FIRST' => 'NULLS FIRST',
            'ORDER_LAST' => 'NULLS LAST',
            null => '',
            default => throw new \Exception('Invalid nulls option'),
        };

        $this->orderByRaw("$columnSql $orderOptionSql $nullsOptionSql");

        return $this;
    }

    /**
     * Filter for pools the user is allowed to admin, based on scopeAuthorizedToAdmin
     */
    public function canAdmin(?bool $canAdmin): self
    {
        if ($canAdmin) {
            return $this->authorizedToAdmin();
        }

        return $this;
    }

    public function authorizedToAdmin(): self
    {
        /** @var User | null */
        $user = Auth::user();

        // if they can view any, then nothing filtered out
        if ($user?->isAbleTo('view-any-assessmentPlan')) {
            return $this;
        }

        // if they can view team plans, then filter by teams
        if ($user?->isAbleTo('view-team-assessmentPlan')) {
            return $this->where(function (Builder $query) use ($user) {
                /** Only add teams the user can view pools in to the query for `whereHas`
                 * @var array<Team> $teams
                 */
                $teams = $user->rolesTeams()->get();
                $teamIds = [];
                foreach ($teams as $team) {
                    if ($user->isAbleTo('view-team-assessmentPlan', $team)) {
                        $teamIds[] = $team->id;
                    }
                }

                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('department.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
            });
        }

        // the user can't see any assessment plans
        return $this->where('id', null);
    }

    public function authorizedToView(): self
    {
        /** @var User | null */
        $user = Auth::user();

        // can view any pool - return query with no filters added
        if ($user?->isAbleTo('view-any-pool')) {
            return $this;
        }

        // we might want to add some filters for some pools
        $filterCountBefore = count($this->getQuery()->wheres);
        $this->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-draftPool')) {
                /** Only add teams the user can view pools in to the query for `whereHas`
                 * @var array<Team> $teams
                 */
                $teams = $user->rolesTeams()->get();
                $teamIds = [];
                foreach ($teams as $team) {
                    if ($user->isAbleTo('view-team-draftPool', $team)) {
                        $teamIds[] = $team->id;
                    }
                }

                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('department.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
            }

            if ($user?->isAbleTo('view-any-publishedPool')) {
                $query->orWhere('published_at', '<=', now());
            }
        });
        $filterCountAfter = count($this->getQuery()->wheres); // will not increment if an empty "where" subquery above
        if ($filterCountAfter > $filterCountBefore) {
            return $this;
        }

        // fall through - anyone can view a published pool
        return $this->wherePublished();
    }

    public function withPolicyEagerLoads(): self
    {
        return $this->with(['team', 'community.team', 'department.team']);
    }

    /**
     * Add a component to the match score
     *
     * @param  string  $sql  expression evaluating to 0..1 for each pool
     * @param  array<int, mixed>  $bindings
     */
    public function addMatchScore(string $sql, array $bindings, float $weight): self
    {
        $this->matchScoreParts[] = [
            'sql' => sprintf('(%F * (%s))', $weight, $sql),
            'bindings' => $bindings,
        ];

        return $this;
    }

    /**
     * Score how many of the selected values a multi-valued attribute matches
     *
     * Scores (sum of matched row weights) / (number of values selected), so 0..1
     * when row weights are 0..1. The relation must be a HasMany on Pool.
     *
     * @param  string  $relationName  HasMany relation holding the attribute rows
     * @param  string  $valueColumn  column on the related table compared to $values
     * @param  array<int, string>  $values  values selected by the user
     * @param  string|null  $rowWeightSql  trusted SQL weighting each matched row, defaults to 1
     */
    public function addOverlapScore(
        string $relationName,
        string $valueColumn,
        array $values,
        float $weight,
        ?string $rowWeightSql = null,
    ): self {
        $values = array_values(array_unique($values));
        if (empty($values)) {
            return $this;
        }

        /** @var HasMany $relation */
        $relation = $this->getModel()->{$relationName}();
        $related = $relation->getRelated();

        $matchedWeight = $related->newQuery()
            ->toBase()
            ->selectRaw(sprintf('COALESCE(SUM(%s), 0)', $rowWeightSql ?? '1.0'))
            ->whereColumn($relation->getQualifiedForeignKeyName(), $relation->getQualifiedParentKeyName())
            ->whereIn($related->qualifyColumn($valueColumn), $values);

        return $this->addMatchScore(
            sprintf('(%s) / %d.0', $matchedWeight->toSql(), count($values)),
            $matchedWeight->getBindings(),
            $weight,
        );
    }

    /**
     * Add each pool's match score as a `match_score` column, so results can be sorted by it
     *
     * The score is the total of the parts the filter scopes added, or 0 if none were used.
     * List this scope on any query that offers the match rank sort.
     */
    public function withMatchScore(): self
    {
        // 0.0 and not 0, so the column is a decimal whether or not anything was scored
        $sql = empty($this->matchScoreParts) ? '0.0' : implode(' + ', array_column($this->matchScoreParts, 'sql'));
        $bindings = array_merge([], ...array_column($this->matchScoreParts, 'bindings'));

        // The score is worked out in a small side query joined to each pool, not in the sort itself.
        // Cursor pagination can only page through a plain column.
        //
        // OFFSET 0 does not change the result. It makes Postgres work the score out once per pool.
        // Without it the score is recalculated several times per pool, and later pages were up to
        // 4 times slower.
        $this->query->joinLateral(
            $this->query->newQuery()->selectRaw("($sql) as ".self::MATCH_SCORE_COLUMN, $bindings)->offset(0),
            'pool_match_scores',
        );

        return $this;
    }
}
