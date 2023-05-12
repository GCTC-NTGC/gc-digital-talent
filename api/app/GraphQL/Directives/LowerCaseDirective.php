<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgSanitizerDirective;

final class LowerCaseDirective extends BaseDirective implements ArgSanitizerDirective, ArgDirective
{
    public static function definition(): string
    {
        return
            /** @lang GraphQL */
            <<<'GRAPHQL'

"""
Shift an input string to lowercase
"""
directive @lowerCase on INPUT_FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * Sanitize the value of an argument given to a field.
     *
     * @param  mixed  $argumentValue  The value given by the client
     *
     * @return mixed the sanitized value
     */
    public function sanitize($argumentValue)
    {
        if (is_string($argumentValue)) {
            return strtolower($argumentValue);
        }
        return $argumentValue;
    }
}
