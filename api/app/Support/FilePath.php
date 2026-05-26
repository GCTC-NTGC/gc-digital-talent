<?php

namespace App\Support;

class FilePath
{
    /**
     * Normalizes a string into a safe, cross-platform file name.
     * Preserves French characters while stripping path separators and dots.
     */
    public static function sanitize(string $input, bool $preserveExtension = false, int $length = 150): string
    {
        // Remove dots to prevent directory traversal and double extensions
        if ($preserveExtension && str_contains($input, '.')) {
            $lastDot = strrpos($input, '.');
            $extension = substr($input, $lastDot + 1);
            // Replace internal dots (e.g. version numbers like 2.72.2) with underscores
            $name = str_replace('.', '_', substr($input, 0, $lastDot)).'.'.$extension;
        } else {
            // No dots allowed at all (prevents double extensions)
            $name = str_replace('.', '_', $input);
        }

        // Keep French letters, numbers, spaces, and dashes
        // Extension requires \.
        $allowedPattern = $preserveExtension ? '/[^\p{L}\p{N}\s\-\_\.]/u' : '/[^\p{L}\p{N}\s\-\_]/u';
        $name = preg_replace($allowedPattern, '', $name);

        // Normalize whitespace and trim
        $name = str_replace(['..', '/', '\\'], '', $name);
        $name = trim(preg_replace('/\s+/', ' ', $name));

        // Truncate to safe OS limits (default 150 is well under the 255 limit)
        return mb_strimwidth($name, 0, $length);
    }
}
