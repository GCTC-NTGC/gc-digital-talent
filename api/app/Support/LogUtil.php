<?php

namespace App\Support;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

/**
 * LogUtil
 *
 * Handy utilities for logging
 */
class LogUtil
{
    // Pull some details from a response to add as an array to the logging context
    public static function responseContext(Response $response): array
    {
        return [
            'status' => $response->status(),
            'body-preview' => Str::limit(Str::squish($response->body()), 500),
        ];
    }

    // Take a string and prepare it for logging by removing newlines
    public static function cleanString(string $s): string
    {
        return str_replace(["\r\n", "\n", "\r"], ' ', $s);
    }

    // Take an array and prepare it for logging by masking sensitive fields and turning it into a string
    public static function cleanArray(array $array): string
    {
        $unsafeKeys = ['client_secret', 'password'];

        foreach ($unsafeKeys as $key) {
            if (array_key_exists($key, $array)) {
                $array[$key] = Str::mask($array[$key], '*', 0);
            }
        }

        return json_encode($array);
    }
}
