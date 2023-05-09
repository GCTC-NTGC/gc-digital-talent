<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldResolver;
use Illuminate\Support\Facades\Log;

final class SelfDirective extends BaseDirective implements FieldResolver
{
    // TODO implement the directive https://lighthouse-php.com/master/custom-directives/getting-started.html

    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<'GRAPHQL'
"""
The field will be resolved to the same value as its parent.
For example, useful in the following situation:
type User {
    profile: Applicant @self
}
"""
directive @self(
    """
    The key to use from the parent.
    """
    key: String on FIELD_DEFINITION
) on FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * Set a field resolver on the FieldValue.
     *
     * This must call $fieldValue->setResolver() before returning
     * the FieldValue.
     *
     * @param  \Nuwave\Lighthouse\Schema\Values\FieldValue  $fieldValue
     * @return \Nuwave\Lighthouse\Schema\Values\FieldValue
     */
    public function resolveField(FieldValue $fieldValue)
    {
        $fieldValue->setResolver(function ($root, array $args) {
            $key = $this->directiveArgValue('key');
            if ($key) {
                return $root->{$key};
            }
            return $root;
        });

        return $fieldValue;
    }
}
