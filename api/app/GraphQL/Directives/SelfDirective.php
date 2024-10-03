<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldResolver;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final class SelfDirective extends BaseDirective implements FieldResolver
{
    // implement the directive https://lighthouse-php.com/6/custom-directives/getting-started.html#implementing-your-own-directives

    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<'GRAPHQL'
"""
The field will be resolved to the same value as its parent.
For example, useful in the following situation:
type User {
    profile: User @self
}
"""
directive @self on FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * Set a field resolver on the FieldValue.
     *
     * This must call $fieldValue->setResolver() before returning
     * the FieldValue.
     */
    public function resolveField(FieldValue $fieldValue): callable
    {
        return function (mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo): mixed {
            return $root;
        };
    }
}
