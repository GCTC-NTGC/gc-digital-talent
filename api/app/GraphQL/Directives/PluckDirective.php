<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Execution\Arguments\ArgumentSet;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgDirectiveForArray;
use Nuwave\Lighthouse\Support\Contracts\ArgTransformerDirective;
use Nuwave\Lighthouse\Support\Utils;

final class PluckDirective extends BaseDirective implements ArgDirectiveForArray, ArgTransformerDirective
{
    // TODO implement the directive https://lighthouse-php.com/master/custom-directives/getting-started.html

    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'

"""
Transforms an input field before resolving.
If used on an array, this plucks a value from each object, returning a flattened array.
If used on a single object, this returns the value at key.
"""
directive @pluck(
    """
    The key to pluck from each object.
    """
    key: String!
) on INPUT_FIELD_DEFINITION
GRAPHQL;
    }

    /**
     * Remove whitespace from the beginning and end of a given input.
     */
    public function transform($argumentValue)
    {
        $output = Utils::mapEach(
            function ($value) {
                return $this->pluckFromArgumentSet($value);
            },
            $argumentValue
        );
        return $output;
    }

    protected function pluckFromArgumentSet(ArgumentSet $argumentSet)
    {
        $key = $this->directiveArgValue('key');
        return $argumentSet->arguments[$key]->value;
    }
}
