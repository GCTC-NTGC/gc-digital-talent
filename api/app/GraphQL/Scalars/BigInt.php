<?php

namespace App\GraphQL\Scalars;

use GraphQL\Error\Error;
use GraphQL\Error\InvariantViolation;
use GraphQL\Language\AST\IntValueNode;
use GraphQL\Language\AST\Node;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Utils\Utils;

/**
 * A signed integer, not limited to the 32-bit range of the built-in `Int` scalar.
 *
 * Read more about scalars here https://webonyx.github.io/graphql-php/type-definitions/scalars
 */
final class BigInt extends ScalarType
{
    /**
     * Serializes an internal value to include in a response.
     *
     * @param  mixed  $value
     */
    public function serialize($value): int
    {
        return $this->isValidBigInt($value, InvariantViolation::class);
    }

    /**
     * Parses an externally provided value (query variable) to use as an input.
     *
     * @param  mixed  $value
     */
    public function parseValue($value): int
    {
        return $this->isValidBigInt($value, InvariantViolation::class);
    }

    /**
     * Parses an externally provided literal value (hardcoded in GraphQL query) to use as an input.
     *
     * @param  Node  $valueNode
     * @param  array<string, mixed>|null  $variables
     *
     * @throws Error
     */
    public function parseLiteral($valueNode, ?array $variables = null): int
    {
        if (! $valueNode instanceof IntValueNode) {
            throw new Error(
                "Query error: Can only parse integers, got {$valueNode->kind}",
                $valueNode
            );
        }

        return $this->isValidBigInt($valueNode->value, Error::class);
    }

    /**
     * Check that the value is a valid integer, of any size.
     *
     * @param  mixed  $value  A value that may represent an integer
     *
     * @throws InvariantViolation|Error
     */
    private function isValidBigInt($value, string $exceptionClass): int
    {
        if (! is_int($value) && ! (is_string($value) && preg_match('/^-?\d+$/', $value) === 1)) {
            throw new $exceptionClass(
                Utils::printSafeJson('validation.integer')
            );
        }

        return (int) $value;
    }
}
