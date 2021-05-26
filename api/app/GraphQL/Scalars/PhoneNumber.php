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
A phone number which complies with E.123 international notation.
Such a phone number is composed of a country code (preceded by a '+'), and then three digit area code
and a local number (in groups of three and four), divided into groups by spaces.
DESCRIPTION;

    public static function regex(): string
    {
        return '/^\+[0-9]{1,3} [0-9]{3} [0-9]{3} [0-9]{4}$/';
    }
}
