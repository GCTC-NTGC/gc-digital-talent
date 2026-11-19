<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use Exception;
use GraphQL\Error\Error;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\Cursor;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use UnexpectedValueException;

class PaginationArgs
{
    final public function __construct(
        public int $perPage,
        public ?Cursor $cursor,

    ) {}

    /**
     * Create a new instance from user given args.
     *
     * @param  array<string, mixed>  $args
     */
    public static function extractArgs(array $args, ResolveInfo $resolveInfo, ?int $paginateMaxCount): self
    {
        if (array_key_exists('first', $args)) {
            // forward pagination
            $perPageArg = $args['first'];
            $cursorArg = $args['after'] ?? null;
        } elseif (array_key_exists('last', $args)) {
            // reverse pagination
            $perPageArg = $args['last'];
            $cursorArg = $args['before'] ?? null;
        } else {
            throw new Error('Missing pagination arguments.'); // Calling validateArgs first should prevent this from ever hitting.
        }

        $perPage = $perPageArg;
        $cursor = Cursor::fromEncoded($cursorArg);
        // an undecodable cursor comes back null, which would silently return the first page
        if ($cursorArg !== null && $cursor === null) {
            throw new Error('The cursor is not valid.');
        }

        if ($perPage < 0) {
            throw new Error(self::requestedLessThanZeroItems($perPage));
        }

        // Make sure the maximum pagination count is not exceeded
        if (
            $paginateMaxCount !== null
            && $perPage > $paginateMaxCount
        ) {
            throw new Error(self::requestedTooManyItems($paginateMaxCount, $perPage));
        }

        return new static($perPage, $cursor);
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
     * @param  Builder|EloquentBuilder<TModel>|Relation<Model, TModel, TModel>  $builder
     * @return CursorPaginator<array-key, TModel>
     */
    public function applyToBuilder(QueryBuilder|EloquentBuilder|Relation $builder): CursorPaginator
    {
        if ($this->perPage === 0) {
            return new ZeroPerPagePaginator();
        }

        $query = match (true) {
            $builder instanceof QueryBuilder => $builder,
            $builder instanceof EloquentBuilder => $builder->getQuery(),
            $builder instanceof Relation => $builder->getQuery()->getQuery()
        };
        // Builder->ensureOrderForCursorPagination filters out any ordering that does not include a `direction` property.
        // orders is null when nothing was sorted; Laravel then sorts by the primary key
        if (! Arr::every($query->orders ?? [], fn ($o) => array_key_exists('direction', $o))) {
            throw new Exception('This directive does not support ordering without directions, like orderByRaw.');
        }

        $this->ensureUniqueOrder($builder, $query);

        try {
            return $builder->cursorPaginate(perPage: $this->perPage, columns: ['*'], cursorName: 'cursor', cursor: $this->cursor);
        } catch (UnexpectedValueException) {
            // the cursor lacks one of this query's sort columns
            // a cursor for the same columns sorted the other way isn't caught: cursors don't record the direction
            throw new Error('The cursor does not match the ordering of this query.');
        }
    }

    /**
     * Sort by the primary key last, unless it's already sorted on
     *
     * Rows that tie on every sort column can be skipped or repeated between pages otherwise.
     */
    private function ensureUniqueOrder(QueryBuilder|EloquentBuilder|Relation $builder, QueryBuilder $query): void
    {
        // with no sort at all, Laravel already sorts by the primary key
        if (empty($query->orders)) {
            return;
        }

        $model = match (true) {
            $builder instanceof EloquentBuilder => $builder->getModel(),
            $builder instanceof Relation => $builder->getRelated(),
            default => throw new Exception('Cursor pagination of a plain query builder needs a unique column in its sort.'),
        };

        $keyColumns = [$model->getKeyName(), $model->getQualifiedKeyName()];
        if (! Arr::first($query->orders, fn ($order) => in_array($order['column'], $keyColumns, true))) {
            $query->orderBy($model->getQualifiedKeyName(), Arr::last($query->orders)['direction']);
        }
    }

    /*
     * Validate that the arguments are consistent with each other.
     * @param  array<string, mixed>  $args
     */
    public static function validateArgs(array $args): void
    {
        $validator = Validator::make($args, [
            'first' => [
                'required_without:last',
                'prohibits:last,before',
                'gte:0',
            ],
            'last' => [
                'required_without:first',
                'prohibits:first,after',
                'gte:0',
            ],
        ]);

        if ($validator->fails()) {
            throw new ValidationException('Pagination arguments fail validation.', $validator);
        }
    }
}
