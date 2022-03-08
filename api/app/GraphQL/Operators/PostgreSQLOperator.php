<?php
namespace App\GraphQL\Operators;

use \Nuwave\Lighthouse\WhereConditions\Operator;
use \Nuwave\Lighthouse\WhereConditions\SQLOperator;

class PostgreSQLOperator extends SQLOperator implements Operator {

    public function enumDefinition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"The available SQL operators that are used to filter query results."
enum SQLOperator {
    "Equal operator (`=`)"
    EQ @enum(value: "=")

    "Not equal operator (`!=`)"
    NEQ @enum(value: "!=")

    "Greater than operator (`>`)"
    GT @enum(value: ">")

    "Greater than or equal operator (`>=`)"
    GTE @enum(value: ">=")

    "Less than operator (`<`)"
    LT @enum(value: "<")

    "Less than or equal operator (`<=`)"
    LTE @enum(value: "<=")

    "Simple pattern matching (`LIKE`)"
    LIKE @enum(value: "LIKE")

    "Negation of simple pattern matching (`NOT LIKE`)"
    NOT_LIKE @enum(value: "NOT_LIKE")

    "Whether a value is within a set of values (`IN`)"
    IN @enum(value: "In")

    "Whether a value is not within a set of values (`NOT IN`)"
    NOT_IN @enum(value: "NotIn")

    "Whether a value is within a range of values (`BETWEEN`)"
    BETWEEN @enum(value: "Between")

    "Whether a value is not within a range of values (`NOT BETWEEN`)"
    NOT_BETWEEN @enum(value: "NotBetween")

    "Whether a value is null (`IS NULL`)"
    IS_NULL @enum(value: "Null")

    "Whether a value is not null (`IS NOT NULL`)"
    IS_NOT_NULL @enum(value: "NotNull")

    "Whether a set of values contains a value (`@>`)"
    CONTAINS @enum(value: "JsonContains")
}
GRAPHQL;
    }

    protected function operatorArity(string $operator): int
    {
        if (in_array($operator, ['Null', 'NotNull'])) {
            return 1;
        }

        if (in_array($operator, ['In', 'NotIn', 'Between', 'NotBetween', 'JsonContains'])) {
            return 2;
        }

        return 3;
    }
}
