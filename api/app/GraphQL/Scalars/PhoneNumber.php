<?php

namespace App\GraphQL\Scalars;

use MLL\GraphQLScalars\Regex;

/**
 * Read more about scalars here https://webonyx.github.io/graphql-php/type-definitions/scalars
 */
class PhoneNumber extends Regex
{
    /**
     * The description that is used for schema introspection.
     *
     * @var string
     */
    public $description = <<<'DESCRIPTION'
A phone number which complies with E.164 international notation.
Such a phone number is composed of a '+', a country code (1-3 digits), and then a subscriber number (1-12 digits).
The number is not broken up by any spaces, dashes, parentheses, etc.
Note that the country code for Canada and the US is +1.
DESCRIPTION;

    public static function regex(): string
    {
        return '/^\+[1-9]\d{1,14}$/';
    }
}
