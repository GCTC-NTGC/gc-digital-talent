<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SupportController extends Controller
{
    public function createTicket(Request $request)
    {
        $response = Http::withBasicAuth(config('freshdesk.api.key'), 'X')
            ->post(
                config('freshdesk.api.tickets_endpoint'),
                [
                    'description' => $request->input('description'),
                    'subject' => $request->input('subject'),
                    'email' => $request->input('email'),
                    'priority' => 1, // Required by Freshdesk API. Priority of the ticket. The default value is 1.
                    'status' => 2, // Required by Freshdesk API. Status of the ticket. The default Value is 2.
                    'tags' => [config('freshdesk.api.ticket_tag')],
                ]
        );
        if( $response->status() == 201){ // status code 201 = created.
            return response()->json($response->body(), 200);
        } else {
            return response()->json($response->body(), 400);
        }
    }
}
