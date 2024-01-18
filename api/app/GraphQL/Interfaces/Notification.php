<?php

namespace App\GraphQL\Interfaces;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final class Notification
{
    /**
     * The type registry.
     *
     * @var \Nuwave\Lighthouse\Schema\TypeRegistry
     */
    protected $typeRegistry;

    public function __construct(TypeRegistry $typeRegistry)
    {
        $this->typeRegistry = $typeRegistry;
    }

    /**
     * Decide which GraphQL type a resolved value has.
     *
     * @param  mixed  $rootValue  The value that was resolved by the field. Usually an Eloquent model.
     */
    public function __invoke($rootValue, GraphQLContext $context, ResolveInfo $resolveInfo): Type
    {
        // The notification type field contains the class name, like "App\Notifications\PoolCandidateStatusChanged".
        // By convention, the GraphQL type name will be the base name with the Notification suffix, like "PoolCandidateStatusChangedNotification".
        return $this->typeRegistry->get(class_basename($rootValue->type).'Notification');
    }
}
