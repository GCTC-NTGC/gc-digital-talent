<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use GraphQL\Error\Error;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\Cursor;
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
        $perPage = $args['first'];

        $encodedAfter = $args['after'] ?? null;
        $cursor = Cursor::fromEncoded($encodedAfter);

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
     * @param  \Illuminate\Database\Query\Builder|\Illuminate\Database\Eloquent\Builder<TModel>|\Illuminate\Database\Eloquent\Relations\Relation<\Illuminate\Database\Eloquent\Model, TModel, TModel>  $builder
     * @return \Illuminate\Contracts\Pagination\CursorPaginator<array-key, TModel>
     */
    public function applyToBuilder(QueryBuilder|EloquentBuilder|Relation $builder): CursorPaginator
    {
        if ($this->perPage === 0) {
            return new ZeroPerPagePaginator();
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
