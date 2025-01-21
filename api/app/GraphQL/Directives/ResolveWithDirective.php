<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Execution\Arguments\Argument;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgResolver;

final class ResolveWithDirective extends BaseDirective implements ArgDirective, ArgResolver
{
    public static function definition(): string
    {
        return
        /** @lang GraphQL */
        <<<'GRAPHQL'
"""
Process an input field by passing it to a specific method. By default, looks for a method on the root object.
Note that if your input field contains an array, it will be passed to the method as a single argument.
"""
directive @resolveWith(
    """
    The method name.
    """
    method: String!
    """
    If class is specified, this will look for a static method on that class. example: "App\\Models\\User"
    """
    class: String
) on INPUT_FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * $value can be a scalar, an array of scalars, an ArgumentSet, or an array of argument sets.
     * ArgumentSets represent nested input types.
     * This function will leave scalars and arrays of scalars alone, and convert ArgumentSets into named php arrays.
     *
     * @param  mixed|\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet|array<\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet>  $value  The slice of arguments that belongs to this nested resolver.
     * @return mixed
     */
    public function toPlainValue($value)
    {
        $arg = new Argument;
        $arg->value = $value;

        return $arg->toPlain();
    }

    /**
     * @param  mixed  $root  The result of the parent resolver.
     * @param  mixed|\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet|array<\Nuwave\Lighthouse\Execution\Arguments\ArgumentSet>  $value  The slice of arguments that belongs to this nested resolver.
     * @return mixed
     */
    public function __invoke(mixed $root, mixed $value)
    {
        $plainValue = $this->toPlainValue($value);
        $method = $this->directiveArgValue('method');
        if ($this->directiveHasArgument('class')) {
            $class = $this->directiveArgValue('class');

            return $class::$method($plainValue);
        } else {
            return $root->$method($plainValue);
        }
    }
}
