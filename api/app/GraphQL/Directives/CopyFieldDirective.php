<?php

namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CopyFieldDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Populate the target field with a copy of the source field.
"""
directive @copyField(
    """
    The source field of the argument from which the value is injected.
    """
    source: String!
    """
    The target field of the argument to which the value is injected.
    """
    target: String!
) repeatable on FIELD_DEFINITION
GRAPHQL;
    }

     /**
     * @throws \Nuwave\Lighthouse\Exceptions\DefinitionException
     */
    public function handleField(FieldValue $fieldValue, Closure $next): FieldValue
    {
        $argumentSource = $this->directiveArgValue('source');
        if (! $argumentSource) {
            throw new DefinitionException(
                "The `copyField` directive on {$fieldValue->getParentName()} [{$fieldValue->getFieldName()}] must have a `source` argument"
            );
        }
        $argumentTarget = $this->directiveArgValue('target');
        if (! $argumentTarget) {
            throw new DefinitionException(
                "The `copyField` directive on {$fieldValue->getParentName()} [{$fieldValue->getFieldName()}] must have a `target` argument"
            );
        }

        $previousResolver = $fieldValue->getResolver();

        return $next(
            $fieldValue->setResolver(
                function ($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($argumentSource, $argumentTarget, $previousResolver) {
                    $sourceValue = data_get($args, $argumentSource);
                    $resolveInfo->argumentSet->addValue($argumentTarget, $sourceValue);

                    return $previousResolver(
                        $rootValue,
                        $resolveInfo->argumentSet->toArray(),
                        $context,
                        $resolveInfo
                    );
                }
            )
        );
    }
}
