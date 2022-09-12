<?php

namespace App\GraphQL\Util;

use Illuminate\Support\Facades\Http;

/**
 * A utility to issue GraphQL requests as if from a client.
 * Adapted from api/vendor/nuwave/lighthouse/src/Testing/MakesGraphQLRequests.php
 */
class GraphQLClient
{
    /**
     * Execute a query as if it was sent as a request to the server.
     *
     * @param  string  $query  The GraphQL query to send
     * @param  array<string, mixed>  $variables  The variables to include in the query
     * @param  array<string, mixed>  $extraParams  Extra parameters to add to the JSON payload
     * @param  array<string, mixed>  $headers  HTTP headers to pass to the POST request
     *
     * @return \Illuminate\Testing\TestResponse
     */
    public static function graphQL(
        string $query,
        array $variables = [],
        array $extraParams = [],
        array $headers = []
    ) {
        $params = ['query' => $query];

        if ([] !== $variables) {
            $params += ['variables' => $variables];
        }

        $params += $extraParams;

        return GraphQLClient::postGraphQL($params, $headers);
    }

    /**
     * Execute a POST to the GraphQL endpoint.
     *
     * Use this over graphQL() when you need more control or want to
     * test how your server behaves on incorrect inputs.
     *
     * @param  array<mixed, mixed>  $data  JSON-serializable payload
     * @param  array<string, string>  $headers  HTTP headers to pass to the POST request
     *
     * @return \Illuminate\Testing\TestResponse
     */
    public static function postGraphQL(array $data, array $headers = [])
    {
        $response = Http::withHeaders($headers)->post(GraphQLClient::graphQLEndpointUrl(), $data);
        return $response->json('data');
    }

    /**
     * Return the full URL to the GraphQL endpoint.
     */
    private static function graphQLEndpointUrl(): string
    {
        return config('app.url').'/graphql';
    }
}
