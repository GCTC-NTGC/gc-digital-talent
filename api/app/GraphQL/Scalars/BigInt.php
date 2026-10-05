<?php

namespace App\GraphQL\Scalars;

use GraphQL\Error\Error;
use GraphQL\Error\InvariantViolation;
use GraphQL\Language\AST\IntValueNode;
use GraphQL\Language\AST\Node;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Utils\Utils;

/**
 * A signed integer, not limited to the 32-bit range of the built-in `Int` scalar,
 * but capped to JavaScript's safe integer range (±2^53 - 1) so values round-trip
 * through JSON/JS clients without silent precision loss.
 *
 * Read more about scalars here https://webonyx.github.io/graphql-php/type-definitions/scalars
 */
final class BigInt extends ScalarType
{
    /**
     * JavaScript's safe integer bounds (±Number.MAX_SAFE_INTEGER, i.e. ±(2^53 - 1)).
     * Values outside this range can't be represented exactly as a JS number, so
     * they're rejected rather than silently losing precision on the client.
     */
    private const MAX_SAFE_INTEGER = 9007199254740991;

    private const MIN_SAFE_INTEGER = -9007199254740991;

    /**
     * Serializes an internal value to include in a response.
     *
     * @param  mixed  $value
     */
    public function serialize($value): int
    {
        return $this->assertValidBigInt($value, InvariantViolation::class);
    }

    /**
     * Parses an externally provided value (query variable) to use as an input.
     *
     * @param  mixed  $value
     */
    public function parseValue($value): int
    {
        return $this->assertValidBigInt($value, InvariantViolation::class);
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

        return $this->assertValidBigInt($valueNode->value, Error::class);
    }

    /**
     * Check that the value is a valid integer within the JS-safe range.
     *
     * @param  mixed  $value  A value that may represent an integer
     *
     * @throws InvariantViolation|Error
     */
    private function assertValidBigInt($value, string $exceptionClass): int
    {
        if (! is_int($value) && ! (is_string($value) && preg_match('/\A-?\d+\z/', $value) === 1)) {
            throw new $exceptionClass(
                Utils::printSafeJson('validation.integer')
            );
        }

        // PHP silently clamps an out-of-range numeric string to PHP_INT_MAX/PHP_INT_MIN
        // on cast, rather than erroring, so the range must be checked after casting.
        $intValue = (int) $value;

        if ($intValue > self::MAX_SAFE_INTEGER || $intValue < self::MIN_SAFE_INTEGER) {
            throw new $exceptionClass(
                Utils::printSafeJson('validation.integer')
            );
        }

        return $intValue;
    }
}
