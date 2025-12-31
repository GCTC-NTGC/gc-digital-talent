<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\NonNull;
use GraphQL\Type\Definition\ObjectType;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Collection;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ConnectionField
{
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
            'hasPreviousPage' => ! is_null($paginator->previousCursor()), // not directly supported by CursorPaginator so we're deriving it
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

        return $values->map(static function ($item, int $index) use ($returnTypeFields): array {
            $data = [];
            foreach ($returnTypeFields as $field) {
                switch ($field->name) {
                    case 'cursor':
                        $data['cursor'] = null; // Not available from CursorPaginator
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
