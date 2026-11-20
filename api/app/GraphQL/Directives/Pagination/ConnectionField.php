<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use Closure;
use Exception;
use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\NonNull;
use GraphQL\Type\Definition\ObjectType;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Pagination\AbstractCursorPaginator;
use Illuminate\Support\Collection;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use WeakMap;

class ConnectionField
{
    /**
     * How to count each paginator's full result set. The cursor paginator can't count for itself.
     *
     * @var \WeakMap<CursorPaginator<*, *>, \Closure(): int>|null
     */
    private static ?WeakMap $totalCounters = null;

    /**
     * @param  \Illuminate\Contracts\Pagination\CursorPaginator<*, *>  $paginator
     * @param  Closure(): int  $counter
     */
    public static function countTotalWith(CursorPaginator $paginator, Closure $counter): void
    {
        self::$totalCounters ??= new WeakMap();
        self::$totalCounters[$paginator] = $counter;
    }

    /**
     * Runs the count query only when a client selects totalCount.
     *
     * @param  \Illuminate\Contracts\Pagination\CursorPaginator<*, *>  $paginator
     */
    public function totalCountResolver(CursorPaginator $paginator): int
    {
        $counter = self::$totalCounters[$paginator] ?? null;
        if ($counter === null) {
            throw new Exception('totalCount is not supported when the paginator comes from a resolver.');
        }

        return $counter();
    }

    /**
     * @param  \Illuminate\Contracts\Pagination\CursorPaginator<*, *>  $paginator
     * @return array{
     *     hasNextPage: bool,
     *     hasPreviousPage: bool,
     *     startCursor: string|null,
     *     endCursor: string|null,
     * }
     */
    public function pageInfoResolver(CursorPaginator $paginator): array
    {
        return [
            'hasNextPage' => $paginator->hasMorePages(),
            'hasPreviousPage' => false, // not supported by CursorPaginator
            'startCursor' => $paginator->previousCursor()?->encode(),
            'endCursor' => $paginator->nextCursor()?->encode(),
        ];
    }

    /**
     * @param  \Illuminate\Contracts\Pagination\CursorPaginator<*, *>  $paginator
     * @param  array<string, mixed>  $args
     * @return Collection<int, array<string, mixed>>
     */
    public function edgeResolver(CursorPaginator $paginator, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): Collection
    {
        // We know those types because we manipulated them during PaginationManipulator
        $nonNullList = $resolveInfo->returnType;
        assert($nonNullList instanceof NonNull);

        $objectLikeType = $nonNullList->getInnermostType();
        assert($objectLikeType instanceof ObjectType || $objectLikeType instanceof InterfaceType);

        $returnTypeFields = $objectLikeType->getFields();

        $values = new Collection(array_values($paginator->items()));

        return $values->map(static function ($item, int $index) use ($returnTypeFields, $paginator): array {
            $data = [];
            foreach ($returnTypeFields as $field) {
                switch ($field->name) {
                    case 'nextCursor':
                        if ($paginator instanceof AbstractCursorPaginator) {
                            $data['nextCursor'] = $paginator->getCursorForItem($item)->encode();
                        } else {
                            $data['nextCursor'] = '';
                        }
                        break;

                    case 'previousCursor':
                        if ($paginator instanceof AbstractCursorPaginator) {
                            $data['previousCursor'] = $paginator->getCursorForItem($item, false)->encode();
                        } else {
                            $data['previousCursor'] = '';
                        }
                        break;

                    case 'node':
                        $data['node'] = $item;
                        break;

                    case 'pivot':
                        $data['pivot'] = $item->pivot;
                        break;

                    default:
                        // All other fields on the return type are assumed to be part
                        // of the edge, so we try to locate them in the pivot attribute
                        if (isset($item->pivot->{$field->name})) {
                            $data[$field->name] = $item->pivot->{$field->name};
                        }
                }
            }

            return $data;
        });
    }
}
