<?php

namespace App\Support;

use App\Exceptions\ApiKeyNotFoundException;
use App\Exceptions\ExternalServiceException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

/**
 * Freshdesk
 *
 * Client for interact with the Freshdesk API
 */
class Freshdesk
{
    private static $MAX_URL_LENGTH = 255;

    private static $MAX_USER_AGENT_LENGTH = 255;

    public static $DEFAULT_LANGUAGE = 'en';

    // error-checked way to get the API endpoint
    protected static function getApiEndpoint(): string
    {
        $apiEndpoint = config('freshdesk.api.endpoint');
        if (empty($apiEndpoint)) {
            throw new ApiKeyNotFoundException('Missing Freshdesk API endpoint');
        }

        return $apiEndpoint;
    }

    // error-checked way to get the API key
    protected static function getApiKey(): string
    {
        $apiKey = config('freshdesk.api.key');
        if (empty($apiKey)) {
            throw new ApiKeyNotFoundException('Missing Freshdesk API key');
        }

        return $apiKey;
    }

    // https://developers.freshdesk.com/api/#authentication
    protected static function getPassword(): string
    {
        // If you use the API key, there is no need for a password. You can use any set of characters as a dummy password.
        return 'X';
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
    public static function createTicket(?array $parameters = []): void
    {
        if (! empty(config('freshdesk.api.ticket_tag'))) {
            Arr::set($parameters, 'tags', [config('freshdesk.api.ticket_tag')]);
        }
        if (! empty(config('freshdesk.api.product_id'))) {
            Arr::set($parameters, 'product_id', (int) config('freshdesk.api.product_id'));
        }

        self::trimValue($parameters, 'custom_fields.cf_page_url', self::$MAX_URL_LENGTH);
        self::trimValue($parameters, 'custom_fields.cf_user_agent', self::$MAX_USER_AGENT_LENGTH);

        $response = Http::withBasicAuth(self::getApiKey(), self::getPassword())
            ->post(
                self::getApiEndpoint().'/tickets',
                $parameters
            );
        assert($response instanceof Response);

        if ($response->created()) {
            return;
        }

        // we didn't get a 201 so let's see if we recognize an error
        $errors = $response->json('errors', []);
        $invalidEmailErrors = array_filter($errors, function ($error) {
            return $error['code'] === 'invalid_value' && $error['field'] === 'email';
        });
        if (! empty($invalidEmailErrors)) {
            // some invalid values were sent
            throw new ExternalServiceException('invalid_email');
        }

        // we don't recognize an error so don't add a message
        Log::error('Error when trying to create a ticket: '.$response->getBody());
        throw new ExternalServiceException();
    }

    /**
     * Create contact
     *
     * Create a single contact in Freshdesk.
     *
     * @param  ?array<mixed>  $parameters  (optional) Array of key => value pairs to submit in the ticket
     *
     * @see https://developers.freshdesk.com/api/#create_ticket
     */
    public static function createContact(?array $parameters = []): void
    {
        $response = Http::withBasicAuth(self::getApiKey(), self::getPassword())
            ->post(
                self::getApiEndpoint().'/contacts',
                $parameters
            );
        assert($response instanceof Response);

        if ($response->created()) {
            return;
        }

        // we don't recognize an error so don't add a message
        Log::error('Error when trying to create a ticket: '.$response->getBody());
        throw new ExternalServiceException();
    }

    /**
     * Find contact by email
     *
     * Get the details of a single contact in Freshdesk.
     *
     * @param  string  $email  The email address of the contact to find
     *
     * @see https://developers.freshdesk.com/api/#list_all_contacts
     */
    public static function findContactByEmail(string $email): array
    {
        // I wish there was a less awkward way to access email address validation
        $validator = Validator::make(['email' => $email], [
            'email' => 'email',
        ]);
        if (! $validator->passes()) {
            throw new InvalidArgumentException(Arr::join($validator->messages()->toArray(), ' '));
        }

        $response = Http::withBasicAuth(self::getApiKey(), self::getPassword())
            ->get(self::getApiEndpoint().'/contacts?email='.$email);
        assert($response instanceof Response);

        if ($response->ok()) {
            return Arr::first($response->json(), default: []);
        }

        // we don't recognize an error so don't add a message
        Log::error('Error when trying to find a contact by email: '.$response->getBody());
        throw new ExternalServiceException();
    }

    /**
     * Update contact
     *
     * Update a single contact in Freshdesk.
     *
     * @param  ?array<mixed>  $parameters  (optional) Array of key => value pairs to submit in the ticket
     *
     * @see https://developers.freshdesk.com/api/#update_contact
     */
    public static function updateContact(int $contactId, ?array $parameters = []): void
    {
        $response = Http::withBasicAuth(self::getApiKey(), self::getPassword())
            ->put(
                self::getApiEndpoint().'/contacts/'.$contactId,
                $parameters
            );
        assert($response instanceof Response);

        if ($response->ok()) {
            return;
        }

        // we don't recognize an error so don't add a message
        Log::error('Error when trying to create a ticket: '.$response->getBody());
        throw new ExternalServiceException();
    }
}
