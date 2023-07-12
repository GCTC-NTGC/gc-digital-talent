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

class HasPermissionDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<GRAPHQL
"""
Limit field access to users of a certain role.
"""
directive @hasPermission(
  """
  The name of the permission authorized users need to have for the field and type.
  """
  permissions: [String]!
  """
  The name of the column to check for ownership.
  """
  ownerKey: String
) on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue, Closure $next): FieldValue
    {
        $originalResolver = $fieldValue->getResolver();

        $fieldValue->setResolver(function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo) use ($originalResolver) {
            $permissions = $this->directiveArgValue('permissions');
            $ownerKey = $this->directiveArgValue('ownerKey');

            // Throw in case of an invalid schema definition to remind the developer
            if ($permissions === null || empty($permissions)) {
                throw new DefinitionException("Missing argument 'permissions' for directive '@hasPermission'.");
            }

            $user = User::find($context->user()->id);
            $owned = $ownerKey && $user->id === $root->$ownerKey;
            $checkOwnership = false;

            foreach ($permissions as $permission) {
                if (strpos('-own-', $permission)) {
                    $checkOwnership = true;
                    break;
                }
            }

            $authorized = $user->hasPermission($permissions);
            if ($checkOwnership && !$owned) $authorized = false;

            return $authorized ? $originalResolver($root, $args, $context, $resolveInfo) : null;
        });

        return $next($fieldValue);
    }
}
