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
use Illuminate\Support\Facades\Log;

class HasRolesDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<GRAPHQL
"""
Limit field access to users of a certain role.
"""
directive @hasRoles(
  """
  The name of the role authorized users need to have.
  """
  requiredRoles: [String]!
  """
  Database column for foreign key indicating ownership
  """
  ownerKey: String
) on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue, Closure $next): FieldValue
    {
        $originalResolver = $fieldValue->getResolver();

        $fieldValue->setResolver(function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($originalResolver) {
            $requiredRoles = $this->directiveArgValue('requiredRoles');
            $ownerKey = $this->directiveArgValue('ownerKey');

            // Throw in case of an invalid schema definition to remind the developer
            if ($requiredRoles === null || empty($requiredRoles)) {
                throw new DefinitionException("Missing argument 'requiredRoles' for directive '@canAccess'.");
            }

            $user = User::find($context->user()->id);
            $owned = $ownerKey && $user->id === $root->$ownerKey;
            $authorized = $user && $user->hasRole($requiredRoles);

            if ($owned || $authorized) {
                return $originalResolver($root, $args, $context, $resolveInfo);
            }

            return null;
        });

        return $next($fieldValue);
    }
}
