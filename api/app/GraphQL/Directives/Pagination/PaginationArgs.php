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
        if (! Arr::every($query->orders, fn ($o) => array_key_exists('direction', $o))) {
            throw new Exception('This directive does not support ordering without directions, like orderByRaw.');
        }

        return $builder->cursorPaginate(perPage: $this->perPage, columns: ['*'], cursorName: 'cursor', cursor: $this->cursor);
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
