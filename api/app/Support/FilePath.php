<?php

namespace App\Support;

class FilePath
{
    /**
     * Normalizes a string into a safe, cross-platform file name.
     * Preserves French characters while stripping path separators and dots.
     */
    public static function sanitize(string $input, int $length = 150): string
    {
        // Remove dots to prevent directory traversal and double extensions
        $name = str_replace('.', ' ', $input);

        // Keep French letters, numbers, spaces, and dashes
        $name = preg_replace('/[^\p{L}\p{N}\s\-]/u', '', $name);

        // Normalize whitespace and trim
        $name = trim(preg_replace('/\s+/', ' ', $name));

        // Truncate to safe OS limits (default 150 is well under the 255 limit)
        return mb_strimwidth($name, 0, $length);
    }
}
