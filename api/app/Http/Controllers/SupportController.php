<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupportController extends Controller
{
    public function createTicket(Request $request)
    {
        if (! config('freshdesk.api.tickets_endpoint') || ! config('freshdesk.api.key')) {
            Log::error('Attempted to create a ticket with missing config values.');

            return response([
                'apiResponse' => 'Missing parameters',
            ], 500);
        }
        $parameters = [
            'description' => $request->input('description'),
            'subject' => $request->input('subject'),
            'email' => $request->input('email'),
            'name' => $request->input('name'),
            'priority' => 1, // Required by Freshdesk API. Priority of the ticket. The default value is 1.
            'status' => 2, // Required by Freshdesk API. Status of the ticket. The default value is 2.
            'tags' => [config('freshdesk.api.ticket_tag')],
        ];
        if ($request->input('previous_url')) {
            $parameters['custom_fields']['cf_page_url'] = (string) $request->input('previous_url');
        }
        if ($request->input('user_id')) {
            $parameters['unique_external_id'] = (string) $request->input('user_id');
        }
        if (config('freshdesk.api.product_id')) {
            $parameters['product_id'] = (int) config('freshdesk.api.product_id');
        }
        if (config('freshdesk.api.email_config_id')) {
            $parameters['email_config_id'] = (int) config('freshdesk.api.email_config_id');
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
        Log::error('Error when trying to create a ticket: '.$response->getBody(true));

        return response([
            'serviceResponse' => 'error',
        ], 500);

    }
}
