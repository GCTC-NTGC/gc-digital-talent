<?php
// REF: https: //lighthouse-php.com/5/security/authorization.html#custom-field-restrictions
namespace App\GraphQL\Directives;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use App\Models\User;

class CanAccessDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<GRAPHQL
"""
Limit field access to users of a certain role.
"""
directive @canAccess(
  """
  The name of the role authorized users need to have.
  """
  requiredRoles: [String]!
) on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue, Closure $next): FieldValue
    {
        $originalResolver = $fieldValue->getResolver();

        $fieldValue->setResolver(function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($originalResolver) {
            $requiredRoles = $this->directiveArgValue('requiredRoles');
            // Throw in case of an invalid schema definition to remind the developer
            if ($requiredRoles === null || empty($requiredRoles)) {
                throw new DefinitionException("Missing argument 'requiredRoles' for directive '@canAccess'.");
            }

            $user = User::find($context->user()->id);
            if (
                // Unauthenticated users don't get to see anything
                !$user
                // The user's role has to match have the required role
                || !$user->hasRole($requiredRoles)
            ) {
                return null;
            }

            return $originalResolver($root, $args, $context, $resolveInfo);
        });

        return $next($fieldValue);
    }
}
