<?php

namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Auth\CanDirective;

class CanAsParentDirective extends CanDirective
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Check a Laravel Policy to ensure the current user is authorized to access a field. The policy for the parent of this field is used.
"""
directive @canAsParent(
  """
  The ability to check permissions for.
  """
  ability: String!
) repeatable on FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * Ensure the user is authorized to access this field.
     */
    public function handleField(FieldValue $fieldValue, Closure $next): FieldValue
    {
        try{
        $previousResolver = $fieldValue->getResolver();
        $ability = $this->directiveArgValue('ability');

        $fieldValue->setResolver(
            function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($ability, $previousResolver) {
                $gate = $this->gate->forUser($context->user());
                $checkArguments = $this->buildCheckArguments($args);

                // This is where this class differs from the CanDirective.
                // Instead of guessing what model policy to use based on the type of this field and other directive args (model, scopes, etc), we simply use the model that was returned by the parent resolver.
                $this->authorize($gate, $ability, $root, $checkArguments);

                return $previousResolver($root, $args, $context, $resolveInfo);
            }
        );
    }
    catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";

    }
        return $next($fieldValue);
    }
}
