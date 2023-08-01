<?php

namespace App\GraphQL\Directives;

use Carbon\Carbon;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class InjectNowDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<'GRAPHQL'
"""
Inject the current DateTime into the arguments.
"""
directive @injectNow(
  """
  The target name of the argument into which the current dateTime is injected.
  You can use dot notation to set the value at arbitrary depth
  within the incoming argument.
  """
  name: String!
) repeatable on FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * @throws \Nuwave\Lighthouse\Exceptions\DefinitionException
     */
    public function handleField(FieldValue $fieldValue): void
    {
        $argumentName = $this->directiveArgValue('name');
        if (!$argumentName) {
            throw new DefinitionException(
                "The `inject` directive on {$fieldValue->getParentName()} [{$fieldValue->getFieldName()}] must have a `name` argument"
            );
        }

        $dateNow = Carbon::now();

        $fieldValue->wrapResolver(fn (callable $previousResolver) => function (mixed $root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($previousResolver, $argumentName, $dateNow) {
            $resolveInfo->argumentSet->addValue($argumentName, $dateNow);

            return $previousResolver(
                $root,
                $resolveInfo->argumentSet->toArray(),
                $context,
                $resolveInfo
            );
        });
    }
}
