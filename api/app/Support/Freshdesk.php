<?php

namespace App\Support;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

/**
 * Freshdesk
 *
 * Client for interact with the Freshdesk API
 */
class Freshdesk
{
    private static $MAX_URL_LENGTH = 255;

    private static $MAX_USER_AGENT_LENGTH = 255;

    // error-checked way to get the API endpoint
    protected static function apiEndpoint(): string
    {
        $apiEndpoint = config('freshdesk.api.endpoint');
        if (is_null($apiEndpoint)) {
            throw new \Error('Missing Freshdesk API endpoint');
        }

        return $apiEndpoint;
    }

    // error-checked way to get the API key
    protected static function apiKey(): string
    {
        $apiKey = config('freshdesk.api.key');
        if (is_null($apiKey)) {
            throw new \Error('Missing Freshdesk API key');
        }

        return $apiKey;
    }

    // https://developers.freshdesk.com/api/#authentication
    protected static function password(): string
    {
        // If you use the API key, there is no need for a password. You can use any set of characters as a dummy password.
        return 'X';
    }

    public static function ticketsEndpoint(): string
    {
        return self::apiEndpoint().'/tickets';
    }

    // trim a value in an array to a max length
    protected static function trimValue(array &$array, string $key, int $maxLength): void
    {
        $existingValue = Arr::get($array, $key);
        if (! is_null($existingValue) && strlen($existingValue) > $maxLength) {
            $newValue = substr($existingValue, 0, $maxLength);
            Arr::set($array, $key, $newValue);
        }
    }

    /**
     * Create ticket
     *
     * Create a single ticket in Freshdesk.
     *
     * @param  ?array<mixed>  $parameters  (optional) Array of key => value pairs to submit in the ticket
     *
     * @see https://developers.freshdesk.com/api/#create_ticket
     */
    public static function createTicket(?array $parameters = []): Response
    {
        Arr::set($parameters, 'priority', 1); // Required by Freshdesk API. Priority of the ticket. The default value is 1.
        Arr::set($parameters, 'status', 2); // Required by Freshdesk API. Status of the ticket. The default value is 2.

        if (! empty(config('freshdesk.api.ticket_tag'))) {
            Arr::set($parameters, 'tags', [config('freshdesk.api.ticket_tag')]);
        }
        if (! empty(config('freshdesk.api.product_id'))) {
            Arr::set($parameters, 'product_id', (int) config('freshdesk.api.product_id'));
        }

        self::trimValue($parameters, 'custom_fields.cf_page_url', self::$MAX_URL_LENGTH);
        self::trimValue($parameters, 'custom_fields.cf_user_agent', self::$MAX_USER_AGENT_LENGTH);

        $response = Http::withBasicAuth(self::apiKey(), self::password())
            ->post(
                self::ticketsEndpoint(),
                $parameters
            );
        assert($response instanceof Response);

        return $response;
    }
}
