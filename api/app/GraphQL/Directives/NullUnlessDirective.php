<?php

namespace App\GraphQL\Directives;

use Illuminate\Database\Eloquent\Model;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final class NullUnlessDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<'GRAPHQL'
"""
Resolve the field to null unless the given attribute on the parent model is truthy.
Wraps whatever resolver would otherwise run, so it can be combined with directives
like @belongsTo to short-circuit before the underlying relation is even queried.
"""
directive @nullUnless(
    """
    The attribute (or accessor) to check truthiness of on the parent model.
    """
    attribute: String!
) on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue): void
    {
        $attribute = $this->directiveArgValue('attribute');

        $fieldValue->wrapResolver(
            fn (callable $previousResolver): \Closure => function (Model $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($previousResolver, $attribute) {
                if (! $root->{$attribute}) {
                    return null;
                }

                return $previousResolver($root, $args, $context, $resolveInfo);
            }
        );
    }
}
