<?php

namespace App\GraphQL\Directives;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Auth\CanDirective as CanDirectiveOriginal;

/**
 * This directive adds the `onParent` argument to the Lighthouse Can directive.
 */
class CanOnParentDirective extends CanDirectiveOriginal
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Check a Laravel Policy to ensure the current user is authorized to access a field.

When `injectArgs` and `args` are used together, the client given
arguments will be passed before the static args.
"""
directive @canOnParent(
  """
  The ability to check permissions for.
  """
  ability: String!

  """
  Pass along the client given input data as arguments to `Gate::check`.
  """
  injectArgs: Boolean! = false

  """
  Statically defined arguments that are passed to `Gate::check`.

  You may pass arbitrary GraphQL literals,
  e.g.: [1, 2, 3] or { foo: "bar" }
  """
  args: CanArgs
) repeatable on FIELD_DEFINITION

    """
Any constant literal value: https://graphql.github.io/graphql-spec/draft/#sec-Input-Values
"""
scalar CanOnParentArgs
GRAPHQL;
    }

    /**
     * Ensure the user is authorized to access this field.
     */
    public function handleField(FieldValue $fieldValue, \Closure $next): FieldValue
    {
        $previousResolver = $fieldValue->getResolver();
        $ability = $this->directiveArgValue('ability');

        $fieldValue->setResolver(function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($ability, $previousResolver) {
            $gate = $this->gate->forUser($context->user());
            $checkArguments = $this->buildCheckArguments($args);

            // Instead of guessing what model policy to use based on the type of this field and other directive args (model, scopes, etc), we simply use the model that was returned by the parent resolver.
            $this->authorize($gate, $ability, $root, $checkArguments);

            return $previousResolver($root, $args, $context, $resolveInfo);
        });
        return $next($fieldValue);
    }
}
