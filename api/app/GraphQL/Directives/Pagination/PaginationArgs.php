<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use GraphQL\Error\Error;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\Cursor;
use Laravel\Scout\Builder as ScoutBuilder;
use Nuwave\Lighthouse\Execution\ResolveInfo;

class PaginationArgs
{
    public function __construct(
        public int $first,
        public ?Cursor $after,

    ) {}

    /**
     * Create a new instance from user given args.
     *
     * @param  array<string, mixed>  $args
     */
    public static function extractArgs(array $args, ResolveInfo $resolveInfo, ?int $paginateMaxCount): self
    {
        $first = $args['first'];

        $encodedAfter = $args['after'] ?? null;
        $after = Cursor::fromEncoded($encodedAfter);

        if ($first < 0) {
            throw new Error(self::requestedLessThanZeroItems($first));
        }

        // Make sure the maximum pagination count is not exceeded
        if (
            $paginateMaxCount !== null
            && $first > $paginateMaxCount
        ) {
            throw new Error(self::requestedTooManyItems($paginateMaxCount, $first));
        }

        return new static($first, $after);
    }

    public static function requestedLessThanZeroItems(int $amount): string
    {
        return "Requested pagination amount must be non-negative, got {$amount}.";
    }

    public static function requestedTooManyItems(int $maxCount, int $actualCount): string
    {
        return "Maximum number of {$maxCount} requested items exceeded, got {$actualCount}. Fetch smaller chunks.";
    }

    /**
     * Apply the args to a builder, constructing a paginator.
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  \Illuminate\Database\Query\Builder|\Laravel\Scout\Builder|\Illuminate\Database\Eloquent\Builder<TModel>|\Illuminate\Database\Eloquent\Relations\Relation<TModel>  $builder
     * @return \Illuminate\Contracts\Pagination\CursorPaginator<array-key, TModel>
     */
    public function applyToBuilder(QueryBuilder|ScoutBuilder|EloquentBuilder|Relation $builder): CursorPaginator
    {
        // if ($this->first === 0) {
        //     return new ZeroPerPagePaginator($this->page); // @phpstan-ignore return.type (generic type does not matter)
        // }

        // $methodName = 'paginate';

        // if ($builder instanceof ScoutBuilder) {
        //     return $builder->{$methodName}($this->first, 'page', $this->page);
        // }

        // return $builder->{$methodName}($this->first, ['*'], 'page', $this->page);
        return $builder->cursorPaginate(perPage: $this->first, cursor: $this->after);
    }
}
