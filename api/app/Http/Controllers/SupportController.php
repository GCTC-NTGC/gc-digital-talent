<?php

namespace App\Http\Controllers;

use App\Exceptions\ExternalServiceException;
use App\Support\Freshdesk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

use function Safe\parse_url;

class SupportController extends Controller
{
    public function createTicket(Request $request)
    {
        // what language does the user want to use?
        $requestedLanguage = $request->header('Accept-Language');

        // if they requested a language, ensure the Freshdesk contact is correctly set
        if (! empty($requestedLanguage)) {
            // what is the current language of the contact?
            $currentContactAttributes = Freshdesk::findContactByEmail($request->input('email'));
            $currentContactId = $currentContactAttributes['id'] ?? null;
            $currentLanguage = $currentContactAttributes['language'] ?? null;

            // if there is a current contact but the language is not set correctly, update it
            if (is_int($currentContactId) && strcasecmp($requestedLanguage, $currentLanguage) != 0) {
                try {
                    Freshdesk::updateContact($currentContactId, ['language' => $requestedLanguage]);
                } catch (Throwable $error) {
                    // setting language is best effort only
                    Log::error('Failed to update Freshdesk contact language: '.$error->getMessage());
                }
            }

            // if there is no current contact and the user requested a non-default language, create it with the right language
            if (is_null($currentContactId) && strcasecmp($requestedLanguage, Freshdesk::$DEFAULT_LANGUAGE) != 0) {
                try {
                    Freshdesk::createContact([
                        'name' => $request->input('name'),
                        'email' => $request->input('email'),
                        'language' => $requestedLanguage,
                    ]);
                } catch (Throwable $error) {
                    // setting language is best effort only
                    Log::error('Failed to create Freshdesk contact with language: '.$error->getMessage());
                }
            }
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
            'type' => array_key_exists($request->input('subject'), $type_map) ? $type_map[$request->input('subject')] : null,
        ];
        if ($request->input('previous_url')) {
            $url = parse_url((string) $request->input('previous_url'));
            $path = $url['path'] ?? '/';
            if (isset($url['query'])) {
                $path .= '?'.$url['query'];
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

        try {
            Freshdesk::createTicket($parameters);
        } catch (ExternalServiceException $error) {
            return response([
                'serviceResponse' => 'error',
                'errorDetail' => $error->getMessage(),
            ], 400);
        }

        return response([
            'serviceResponse' => 'success',
        ], 200);

    }
}
