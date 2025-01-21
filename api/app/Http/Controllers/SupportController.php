<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use function Safe\parse_url;

class SupportController extends Controller
{
    private static $MAX_URL_LENGTH = 255;

    public function createTicket(Request $request)
    {
        if (! config('freshdesk.api.tickets_endpoint') || ! config('freshdesk.api.key')) {
            Log::error('Attempted to create a ticket with missing config values.');

            return response([
                'apiResponse' => 'Missing parameters',
            ], 500);
        }
        // string values available from type field via /api/v2/ticket_fields.
        $type_map =
        [
            'question' => 'Question',
            'bug' => 'Bug',
            'feedback' => 'Feedback',
        ];
        $parameters = [
            'description' => $request->input('description'),
            'subject' => $request->input('subject'),
            'email' => $request->input('email'),
            'name' => $request->input('name'),
            'priority' => 1, // Required by Freshdesk API. Priority of the ticket. The default value is 1.
            'status' => 2, // Required by Freshdesk API. Status of the ticket. The default value is 2.
            'tags' => [config('freshdesk.api.ticket_tag')],
            'type' => array_key_exists($request->input('subject'), $type_map) ? $type_map[$request->input('subject')] : null,
        ];
        if ($request->input('previous_url')) {
            $url = parse_url((string) $request->input('previous_url'));
            $path = $url['path'] ?? '/';
            if (isset($url['query'])) {
                $path .= '?'.$url['query'];
            }
            if (strlen($path) > self::$MAX_URL_LENGTH) {
                $path = substr($path, 0, self::$MAX_URL_LENGTH);
            }
            $parameters['custom_fields']['cf_page_url'] = $path;
        }
        if ($request->input('user_agent')) {
            $parameters['custom_fields']['cf_user_agent'] = (string) $request->input('user_agent');
        }
        if ($request->cookie('ai_user')) {
            $parameters['custom_fields']['cf_application_insights_user_id'] = (string) $request->cookie('ai_user');
        }
        if ($request->cookie('ai_session')) {
            $parameters['custom_fields']['cf_application_insights_session_id'] = (string) $request->cookie('ai_session');
        }
        if ($request->input('user_id')) {
            $parameters['unique_external_id'] = (string) $request->input('user_id');
        }
        if (config('freshdesk.api.product_id')) {
            $parameters['product_id'] = (int) config('freshdesk.api.product_id');
        }
        $response = Http::withBasicAuth(config('freshdesk.api.key'), 'X')
            ->post(
                config('freshdesk.api.tickets_endpoint'),
                $parameters
            );
        if ($response->status() == 201) { // status code 201 = created.
            return response([
                'serviceResponse' => 'success',
            ], 200);
        }

        // we didn't get a 201 so let's see if we recognize an error
        $responseBody = $response->json();
        $errors = $responseBody['errors'] ?? [];
        $invalidEmailErrors = array_filter($errors, function ($error) {
            return $error['code'] === 'invalid_value' && $error['field'] === 'email';
        });
        if (! empty($invalidEmailErrors)) {
            // some invalid values were sent
            return response([
                'serviceResponse' => 'error',
                'errorDetail' => 'invalid_email',
            ], 400);
        }

        // we don't recognize an error so send a generic 500
        Log::error('Error when trying to create a ticket: '.$response->getBody());

        return response([
            'serviceResponse' => 'error',
        ], 500);

    }
}
