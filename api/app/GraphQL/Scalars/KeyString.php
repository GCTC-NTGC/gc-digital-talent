<?php

namespace App\GraphQL\Scalars;

use MLL\GraphQLScalars\Regex;

/**
 * Read more about scalars here https://webonyx.github.io/graphql-php/type-definitions/scalars
 */
class KeyString extends Regex
{
    /**
     * The description that is used for schema introspection.
     *
     * @var string
     */
    public $description = <<<'DESCRIPTION'
    Certain models, like our lookup tables, have a "key" field.
    This is meant to act similar to an ID, but be human readable, and allow for code to reference particular items in special circumstance.
DESCRIPTION;

    public static function regex(): string
    {
        // See: https://regex101.com/r/TEDtDo/1
        return '/^[a-z]+[_a-z0-9]*$/';
    }
}
