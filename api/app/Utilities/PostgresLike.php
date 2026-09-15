<?php

namespace App\Utilities;

/**
 * Escaping for LIKE / ILIKE search patterns.
 *
 * Binding a value stops injection but not wildcards: % and _ still work inside the
 * bound value, so searching for "%" matches every row.
 *
 * https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-LIKE
 */
class PostgresLike
{
    /**
     * Escape the wildcards in a user supplied search term.
     *
     * No ESCAPE clause needed - backslash is Postgres's default for LIKE.
     */
    public static function escape(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $value);
    }
}
