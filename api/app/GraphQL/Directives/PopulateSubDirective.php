<?php

namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class PopulateSubDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Populate the sub value from the model into the arguments.
"""
directive @populateSub(
    """
    The source field of the argument from which the value is injected.
    """
    source: String!
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
                "The `populateSub` directive on {$fieldValue->getParentName()} [{$fieldValue->getFieldName()}] must have a `source` argument"
            );
        }

        $previousResolver = $fieldValue->getResolver();

        return $next(
            $fieldValue->setResolver(
                function ($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($argumentSource, $previousResolver) {
                    $subValue = data_get($args, $argumentSource);
                    $resolveInfo->argumentSet->addValue('sub', $subValue);

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
