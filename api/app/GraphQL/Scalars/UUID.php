<?php

namespace App\GraphQL\Scalars;

use GraphQL\Error\Error;
use GraphQL\Error\InvariantViolation;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Utils\Utils;
use Illuminate\Support\Str;

/**
 * Read more about scalars here https://webonyx.github.io/graphql-php/type-definitions/scalars
 */
final class UUID extends ScalarType
{
    /**
     * Serializes an internal value to include in a response.
     *
     * @param  mixed  $value
     * @return string valid uuid
     */
    public function serialize($value)
    {
        return $this->isValidUuid($value, InvariantViolation::class);
    }

    /**
     * Parses an externally provided value (query variable) to use as an input
     *
     * @param  mixed  $value
     * @return string valid uuid
     */
    public function parseValue($value)
    {
        return $this->isValidUuid($value, InvariantViolation::class);
    }

    /**
     * Parses an externally provided literal value (hardcoded in GraphQL query) to use as an input.
     *
     * @param  \GraphQL\Language\AST\Node  $valueNode
     * @param  array<string, mixed>|null  $variables
     * @throws \GraphQL\Error\Error
     * @return string valid uuid
     */
    public function parseLiteral($valueNode, ?array $variables = null)
    {
        if (! $valueNode instanceof StringValueNode) {
            throw new Error(
                "Query error: Can only parse strings, got {$valueNode->kind}",
                $valueNode
            );
        }

        return $this->isValidUuid($valueNode->value, Error::class);
    }

    /**
     * Check if the string is a UUID
     *
     * @param mixed $value  A value that may be a UUID
     * @return  string A valid UUID
     * @throws \GraphQL\Error\InvariantViolation|\GraphQL\Error\Error
     */
    private function isValidUuid($value, string $exceptionClass)
    {
        if(!Str::isUuid($value)) {
            throw new $exceptionClass(
                Utils::printSafeJson('validation.uuid')
            );
        }

        return $value;
    }
}
