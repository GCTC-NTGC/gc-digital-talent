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
    public static function responseContext(Response $response): array
    {
        return ['status' => $response->status(), 'body-preview' => Str::limit(Str::squish($response->body()), 500)];
    }

    public static function cleanString(string $s): string
    {
        return str_replace(["\r\n", "\n", "\r"], ' ', $s);
    }

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
