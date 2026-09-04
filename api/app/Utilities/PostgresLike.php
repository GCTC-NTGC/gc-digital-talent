<?php

namespace App\Utilities;

/**
 * Escaping for LIKE / ILIKE search patterns.
 *
 * Binding a value protects against injection but not against the pattern language:
 * % and _ remain wildcards inside the bound value, so a search for "50%" matches far
 * more than the user asked for, and a search for "%" matches everything.
 *
 * https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-LIKE
 */
class PostgresLike
{
    /**
     * Escape the LIKE metacharacters in a user supplied search term.
     *
     * Backslash is Postgres's default escape character for LIKE, so callers do not
     * need an explicit ESCAPE clause.
     */
    public static function escape(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $value);
    }
}
